import sqlite3
from pathlib import Path
from typing import Dict, Any, List

from app.config import settings

SQLITE_PATH = settings.DATA_DIR / "tactical_operations.db"

class TacticalSQLDatabase:
    def __init__(self, db_path: Path = SQLITE_PATH):
        self.db_path = db_path
        self._initialize_schema()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_schema(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS tactical_outposts (
                outpost_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                sector TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                altitude_m INTEGER NOT NULL,
                troops INTEGER NOT NULL,
                ambient_temp_c REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS tactical_inventory (
                inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
                outpost_id TEXT NOT NULL,
                class1_rations_kg REAL NOT NULL,
                class3_pol_liters REAL NOT NULL,
                class5_ammo_rounds INTEGER NOT NULL,
                class8_medical_kits INTEGER NOT NULL,
                days_of_supply REAL NOT NULL,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (outpost_id) REFERENCES tactical_outposts(outpost_id)
            );
            """)

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS convoy_dispatches (
                order_id TEXT PRIMARY KEY,
                origin_depot TEXT NOT NULL,
                target_outpost TEXT NOT NULL,
                vehicle_type TEXT NOT NULL,
                vehicle_count INTEGER NOT NULL,
                cargo_weight_kg REAL NOT NULL,
                assigned_route TEXT NOT NULL,
                auth_token TEXT NOT NULL,
                status TEXT NOT NULL,
                dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS security_audit_events (
                event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                payload_snippet TEXT,
                threat_score REAL NOT NULL,
                action_taken TEXT NOT NULL,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            cursor.execute("SELECT COUNT(*) as count FROM tactical_outposts")
            if cursor.fetchone()["count"] == 0:
                self._seed_initial_data(cursor)

            conn.commit()

    def _seed_initial_data(self, cursor: sqlite3.Cursor):
        posts = [
            ("OP-DBO-01", "OP Daulat Beg Oldi (DBO)", "Sub-Sector North (SSN)", 35.4022, 77.9297, 5065, 340, -24.0, "CRITICAL"),
            ("OP-SIA-02", "Siachen Glacial Base (Kumar)", "Siachen Glacier", 35.1500, 77.2100, 4880, 210, -29.0, "WARNING"),
            ("OP-GLW-03", "Galwan Post PP-14", "Galwan Valley Axis", 34.7800, 78.1800, 4320, 180, -16.0, "NORMAL"),
            ("OP-PNG-04", "Pangong Tso North Ridge", "Finger 4 - Pangong", 33.7500, 78.4500, 4280, 260, -12.0, "NORMAL")
        ]
        cursor.executemany("""
        INSERT INTO tactical_outposts (outpost_id, name, sector, lat, lng, altitude_m, troops, ambient_temp_c, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, posts)

    def insert_convoy_dispatch(self, order: Dict[str, Any]) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO convoy_dispatches 
            (order_id, origin_depot, target_outpost, vehicle_type, vehicle_count, cargo_weight_kg, assigned_route, auth_token, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order["order_id"], order["origin_depot"], order["target_outpost"],
                order["vehicle_type"], order["vehicle_count"], order["cargo_weight_kg"],
                order["assigned_route"], order["auth_token"], "AUTHORIZED"
            ))
            conn.commit()
            return True

    def query_all_dispatches(self, limit: int = 20) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT * FROM convoy_dispatches ORDER BY dispatched_at DESC LIMIT ?
            """, (limit,))
            return [dict(row) for row in cursor.fetchall()]

    def query_outpost_inventory_summary(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT outpost_id, name, sector, altitude_m, troops, ambient_temp_c, status
            FROM tactical_outposts
            ORDER BY altitude_m DESC
            """)
            return [dict(row) for row in cursor.fetchall()]

sql_database = TacticalSQLDatabase()
