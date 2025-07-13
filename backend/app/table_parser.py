def extract_tables(olm_result: dict) -> list:
    tables = []
    for block in olm_result.get("blocks", []):
        if block.get("type") == "table":
            # Group cells by row
            rows = {}
            for cell in block.get("children", []):
                row_idx = cell.get("row_index")
                col_idx = cell.get("column_index")
                text = cell.get("text", "")
                
                if row_idx not in rows:
                    rows[row_idx] = {}
                rows[row_idx][col_idx] = text
            
            # Convert to 2D array
            table_data = []
            for row_idx in sorted(rows.keys()):
                row = []
                for col_idx in sorted(rows[row_idx].keys()):
                    row.append(rows[row_idx][col_idx])
                table_data.append(row)
            
            # First row as headers
            if table_data:
                tables.append({
                    "headers": table_data[0],
                    "rows": table_data[1:]
                })
    return tables