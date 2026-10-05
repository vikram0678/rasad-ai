"""
========================================================================================
RASAD-AI: Military Temporal Fusion Transformer (TFT) Architecture
Hardware Target: NVIDIA RTX GPU (PyTorch CUDA Accelerated)
Application: Multi-Horizon Quantile Supply Forecasting (P10, P50, P90 Risk Buffers)
Reference: Lim et al. (Google Cloud AI & University of Oxford, 2021)
========================================================================================
"""

import math
import numpy as np

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False


if TORCH_AVAILABLE:
    class GatedLinearUnit(nn.Module):
        """GLU Component for adaptive non-linear gating."""
        def __init__(self, input_dim: int, output_dim: int):
            super().__init__()
            self.linear = nn.Linear(input_dim, output_dim * 2)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            val, gate = self.linear(x).chunk(2, dim=-1)
            return val * torch.sigmoid(gate)


    class GatedResidualNetwork(nn.Module):
        """GRN: Gated Residual Network with LayerNorm and Optional Context Conditioning."""
        def __init__(self, input_dim: int, hidden_dim: int, output_dim: int, context_dim: int = None, dropout: float = 0.1):
            super().__init__()
            self.fc1 = nn.Linear(input_dim, hidden_dim)
            self.context_layer = nn.Linear(context_dim, hidden_dim, bias=False) if context_dim else None
            self.fc2 = nn.Linear(hidden_dim, hidden_dim)
            self.glu = GatedLinearUnit(hidden_dim, output_dim)
            self.layer_norm = nn.LayerNorm(output_dim)
            self.dropout = nn.Dropout(dropout)
            self.skip = nn.Linear(input_dim, output_dim) if input_dim != output_dim else nn.Identity()

        def forward(self, x: torch.Tensor, context: torch.Tensor = None) -> torch.Tensor:
            skip = self.skip(x)
            hidden = F.elu(self.fc1(x))
            if self.context_layer and context is not None:
                hidden = hidden + self.context_layer(context)
            hidden = self.dropout(F.elu(self.fc2(hidden)))
            gated = self.glu(hidden)
            return self.layer_norm(skip + gated)


    class VariableSelectionNetwork(nn.Module):
        """
        VSN: Dynamically weights static & dynamic variables at each time-step,
        providing intrinsic feature attribution and explainability.
        """
        def __init__(self, num_features: int, input_dim: int, hidden_dim: int, context_dim: int = None, dropout: float = 0.1):
            super().__init__()
            self.num_features = num_features
            self.flattened_grn = GatedResidualNetwork(num_features * input_dim, hidden_dim, num_features, context_dim, dropout)
            self.feature_grns = nn.ModuleList([
                GatedResidualNetwork(input_dim, hidden_dim, hidden_dim, context_dim, dropout)
                for _ in range(num_features)
            ])

        def forward(self, x: torch.Tensor, context: torch.Tensor = None) -> torch.Tensor:
            # x shape: [batch, seq_len, num_features, input_dim] or [batch, num_features, input_dim]
            orig_shape = x.shape
            if len(orig_shape) == 4:
                b, s, num_f, feat_d = orig_shape
                flattened = x.reshape(b, s, num_f * feat_d)
                weights = F.softmax(self.flattened_grn(flattened, context), dim=-1).unsqueeze(-1)
                processed = torch.stack([self.feature_grns[i](x[:, :, i, :], context) for i in range(self.num_features)], dim=2)
                weighted_sum = (weights * processed).sum(dim=2)
                return weighted_sum, weights.squeeze(-1)
            else:
                b, num_f, feat_d = orig_shape
                flattened = x.reshape(b, num_f * feat_d)
                weights = F.softmax(self.flattened_grn(flattened, context), dim=-1).unsqueeze(-1)
                processed = torch.stack([self.feature_grns[i](x[:, i, :], context) for i in range(self.num_features)], dim=1)
                weighted_sum = (weights * processed).sum(dim=1)
                return weighted_sum, weights.squeeze(-1)


    class InterpretableMultiHeadAttention(nn.Module):
        """Interpretable multi-head attention with shared value representation."""
        def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
            super().__init__()
            self.d_model = d_model
            self.n_heads = n_heads
            self.d_k = d_model // n_heads

            self.q_linear = nn.Linear(d_model, d_model)
            self.k_linear = nn.Linear(d_model, d_model)
            self.v_linear = nn.Linear(d_model, self.d_k)
            self.out_linear = nn.Linear(self.d_k, d_model)
            self.dropout = nn.Dropout(dropout)

        def forward(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
            b, seq_len, _ = q.shape
            Q = self.q_linear(q).view(b, seq_len, self.n_heads, self.d_k).transpose(1, 2)
            K = self.k_linear(k).view(b, -1, self.n_heads, self.d_k).transpose(1, 2)
            V = self.v_linear(v).unsqueeze(1) # Shared value across heads

            scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
            if mask is not None:
                scores = scores.masked_fill(mask == 0, -1e9)
            attention_weights = F.softmax(scores, dim=-1)
            attention_weights = self.dropout(attention_weights)

            # Average attention weights across heads for interpretability
            avg_attention = attention_weights.mean(dim=1)
            context = torch.matmul(attention_weights, V.repeat(1, self.n_heads, 1, 1)).mean(dim=1)
            output = self.out_linear(context)
            return output, avg_attention


    class MilitaryTemporalFusionTransformer(nn.Module):
        """
        Military-grade Temporal Fusion Transformer (TFT) Architecture.
        Predicts multi-horizon forward supply demand quantiles (P10, P50, P90).
        """
        def __init__(
            self,
            num_static_features: int = 3,      # altitude_m, troop_capacity, post_category
            num_historical_features: int = 6,  # temp_min, apparent_temp, snowfall, wind, fuel_hist, ration_hist
            num_future_features: int = 3,      # predicted_temp, predicted_snow, pass_window_flag
            num_targets: int = 4,              # Class I Rations, Class III Fuel, Class V Ammo, Class VIII Medical
            hidden_dim: int = 64,
            n_heads: int = 4,
            dropout: float = 0.1,
            quantiles: list = [0.10, 0.50, 0.90]
        ):
            super().__init__()
            self.hidden_dim = hidden_dim
            self.num_targets = num_targets
            self.quantiles = quantiles
            self.num_quantiles = len(quantiles)

            # Static Covariate Encoders
            self.static_vsn = VariableSelectionNetwork(num_static_features, 1, hidden_dim, dropout=dropout)
            self.static_context_grn = GatedResidualNetwork(hidden_dim, hidden_dim, hidden_dim, dropout=dropout)

            # Feature Linear Projections
            self.hist_linear = nn.Linear(1, hidden_dim)
            self.future_linear = nn.Linear(1, hidden_dim)

            # Time-Varying VSN
            self.hist_vsn = VariableSelectionNetwork(num_historical_features, hidden_dim, hidden_dim, context_dim=hidden_dim, dropout=dropout)
            self.future_vsn = VariableSelectionNetwork(num_future_features, hidden_dim, hidden_dim, context_dim=hidden_dim, dropout=dropout)

            # Temporal Processing: BiLSTM Encoder & LSTM Decoder
            self.bilstm_encoder = nn.LSTM(hidden_dim, hidden_dim // 2, batch_first=True, bidirectional=True)
            self.lstm_decoder = nn.LSTM(hidden_dim, hidden_dim, batch_first=True)

            # Interpretable Self-Attention
            self.self_attention = InterpretableMultiHeadAttention(hidden_dim, n_heads, dropout=dropout)
            self.post_attention_grn = GatedResidualNetwork(hidden_dim, hidden_dim, hidden_dim, dropout=dropout)

            # Quantile Output Heads (P10, P50, P90 for each target)
            self.quantile_head = nn.Linear(hidden_dim, num_targets * self.num_quantiles)

        def forward(self, static_feats: torch.Tensor, hist_feats: torch.Tensor, future_feats: torch.Tensor) -> dict:
            """
            Forward pass.
            static_feats: [batch, num_static]
            hist_feats:   [batch, hist_len, num_hist]
            future_feats: [batch, future_len, num_future]
            """
            batch_size = static_feats.size(0)
            hist_len = hist_feats.size(1)
            future_len = future_feats.size(1)

            # 1. Static Context
            static_in = static_feats.unsqueeze(-1) # [b, num_static, 1]
            static_embedded, static_weights = self.static_vsn(static_in)
            context = self.static_context_grn(static_embedded) # [b, hidden_dim]

            # 2. Historical & Future Feature Encodings
            hist_proj = self.hist_linear(hist_feats.unsqueeze(-1)) # [b, hist_len, num_hist, hidden]
            hist_embedded, hist_weights = self.hist_vsn(hist_proj, context.unsqueeze(1).expand(-1, hist_len, -1))

            future_proj = self.future_linear(future_feats.unsqueeze(-1)) # [b, future_len, num_future, hidden]
            future_embedded, future_weights = self.future_vsn(future_proj, context.unsqueeze(1).expand(-1, future_len, -1))

            # 3. Temporal Sequence Processing
            enc_out, (h_n, c_n) = self.bilstm_encoder(hist_embedded)
            # Combine h_n from both directions for decoder init
            h_init = torch.cat([h_n[0], h_n[1]], dim=-1).unsqueeze(0)
            c_init = torch.cat([c_n[0], c_n[1]], dim=-1).unsqueeze(0)
            dec_out, _ = self.lstm_decoder(future_embedded, (h_init, c_init))

            # 4. Multi-Head Self-Attention over future horizon
            full_seq = torch.cat([enc_out, dec_out], dim=1)
            att_out, attention_weights = self.self_attention(full_seq, full_seq, full_seq)
            future_att = att_out[:, hist_len:, :] # Slice forecast horizon

            # 5. Residual Post-Attention Gating
            gated_out = self.post_attention_grn(dec_out + future_att)

            # 6. Quantile Projections [batch, future_len, num_targets * num_quantiles]
            raw_quantiles = self.quantile_head(gated_out)
            quantiles_out = raw_quantiles.view(batch_size, future_len, self.num_targets, self.num_quantiles)

            return {
                "quantiles": quantiles_out, # [batch, future_len, 4, 3] (P10, P50, P90)
                "attention_weights": attention_weights,
                "static_weights": static_weights,
                "historical_weights": hist_weights
            }


    class QuantileLoss(nn.Module):
        """Pinball Quantile Loss for probabilistic risk forecasting."""
        def __init__(self, quantiles: list = [0.10, 0.50, 0.90]):
            super().__init__()
            self.quantiles = quantiles

        def forward(self, preds: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
            """
            preds:   [batch, future_len, num_targets, num_quantiles]
            targets: [batch, future_len, num_targets]
            """
            losses = []
            for i, q in enumerate(self.quantiles):
                error = targets - preds[..., i]
                loss = torch.max((q - 1) * error, q * error)
                losses.append(loss.mean())
            return torch.stack(losses).sum()

else:
    class MilitaryTemporalFusionTransformer:
        pass
    class QuantileLoss:
        pass
