from fastapi import APIRouter, Query
from typing import Dict, Any, List

from app.core.sql_db import sql_database

router = APIRouter(tags=["Relational SQL Operations & Persistence"])

@router.get(
    "/sql/dispatches",
    summary="Query Convoy Dispatches via SQL Database",
    description="Executes parameterized SQL SELECT query against relational convoy dispatch table."
)
def get_sql_dispatches(limit: int = Query(20, ge=1, le=100)):
    records = sql_database.query_all_dispatches(limit=limit)
    return {
        "record_count": len(records),
        "dispatches": records
    }

@router.get(
    "/sql/inventory_summary",
    summary="Relational SQL Inventory Health Summary",
    description="Executes relational SQL query joining outposts and their supply states."
)
def get_sql_inventory_summary():
    records = sql_database.query_outpost_inventory_summary()
    return {
        "outpost_count": len(records),
        "outposts": records
    }
