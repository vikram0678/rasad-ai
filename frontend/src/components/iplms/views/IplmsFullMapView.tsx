import React, { useState } from 'react';
import { IplmsMap } from '../IplmsMap';
import { IPLMS_NODES, IplmsSupplyNode } from '../../../data/iplmsData';

interface IplmsFullMapViewProps {
  onSelectNode?: (node: IplmsSupplyNode) => void;
  onSelectIncident?: (locId: string) => void;
}

export const IplmsFullMapView: React.FC<IplmsFullMapViewProps> = ({
  onSelectNode,
  onSelectIncident
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('post-charlie');

  const handleNodeClick = (node: IplmsSupplyNode) => {
    setSelectedNodeId(node.id);
    onSelectNode?.(node);
  };

  return (
    <div className="iplms-full-map-container" style={{ width: '100%', height: 'calc(100vh - 120px)', minHeight: '680px' }}>
      <IplmsMap
        selectedNodeId={selectedNodeId}
        onSelectNode={handleNodeClick}
        onSelectIncidentByLocation={onSelectIncident}
      />
    </div>
  );
};
