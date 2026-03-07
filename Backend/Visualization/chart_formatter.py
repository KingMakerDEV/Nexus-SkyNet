import pandas as pd
from typing import List, Dict

class ChartFormatter:
    def format(self, data: List[Dict], chart_type: str, config: Dict) -> Dict:
        """
        Transform data into a structure suitable for the chart type.
        """
        df = pd.DataFrame(data)

        if chart_type == 'line_chart':
            x_col = config.get('x')
            y_col = config.get('y')
            if x_col and y_col:
                df = df.sort_values(by=x_col)
                return {
                    'labels': df[x_col].tolist(),
                    'values': df[y_col].tolist()
                }

        elif chart_type == 'scatter_plot':
            x_col = config.get('x')
            y_col = config.get('y')
            if x_col and y_col:
                return {
                    'points': [{'x': row[x_col], 'y': row[y_col]} for _, row in df.iterrows()]
                }

        elif chart_type == 'bar_chart':
            x_col = config.get('x')
            y_col = config.get('y')
            if x_col and y_col:
                return {
                    'labels': df[x_col].tolist(),
                    'values': df[y_col].tolist()
                }

        elif chart_type == 'histogram':
            value_col = config.get('value')
            if value_col:
                counts, bins = pd.cut(df[value_col], bins='auto', retbins=True)
                bin_labels = [f"{bins[i]:.2f}-{bins[i+1]:.2f}" for i in range(len(bins)-1)]
                hist_counts = counts.value_counts().sort_index()
                return {
                    'labels': bin_labels,
                    'values': hist_counts.tolist()
                }

        elif chart_type == 'pie_chart':
            cat_col = config.get('category')
            if cat_col:
                counts = df[cat_col].value_counts()
                return {
                    'labels': counts.index.tolist(),
                    'values': counts.values.tolist()
                }

        # Fallback – return raw data
        return {'raw': data}