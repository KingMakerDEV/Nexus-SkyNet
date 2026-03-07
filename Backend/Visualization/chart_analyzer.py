import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple

class ChartAnalyzer:
    def analyze(self, data: List[Dict]) -> Tuple[str, Dict]:
        if not data:
            return 'empty', {}

        df = pd.DataFrame(data)

        # Replace None with NaN for numeric conversion
        df = df.replace([None], np.nan)

        # Identify columns that are fully numeric (after coercion)
        numeric_cols = []
        for col in df.columns:
            # Try to convert to numeric, if successful and not all NaN, treat as numeric
            try:
                numeric_series = pd.to_numeric(df[col], errors='coerce')
                if numeric_series.notna().any():
                    # If the column has at least one non-null numeric value, consider it numeric
                    # Also, if the column is all zeros (sum of absolute values == 0), skip it
                    if numeric_series.abs().sum() > 0:
                        numeric_cols.append(col)
            except:
                continue

        # If we have no numeric columns, fallback
        if not numeric_cols:
            return 'unknown', {}

        # Prefer columns that are likely to be meaningful for space data
        # This is a domain-specific hint – you can expand this list
        preferred_x = ['distance_ly', 'orbital_period_days', 'discovery_year', 'mass_earths', 'radius_earths']
        preferred_y = ['mass_earths', 'radius_earths', 'surface_temp_k', 'habitability_index']

        # Try to find two numeric columns, preferring the preferred lists
        x_col = None
        y_col = None

        # If we have at least two numeric columns
        if len(numeric_cols) >= 2:
            # First, try to pick one from preferred_x and one from preferred_y (could be same)
            for px in preferred_x:
                if px in numeric_cols:
                    x_col = px
                    break
            for py in preferred_y:
                if py in numeric_cols and py != x_col:
                    y_col = py
                    break
            # If still missing, pick first two distinct columns
            if x_col is None or y_col is None:
                remaining = [c for c in numeric_cols if c != x_col]
                if x_col is None and remaining:
                    x_col = remaining[0]
                    remaining = remaining[1:]
                if y_col is None and remaining:
                    y_col = remaining[0]
        elif len(numeric_cols) == 1:
            # Single numeric column – suitable for histogram
            return 'histogram', {'value': numeric_cols[0]}

        if x_col and y_col:
            return 'scatter_plot', {'x': x_col, 'y': y_col}

        # Fallback to histogram with first numeric column
        return 'histogram', {'value': numeric_cols[0]}