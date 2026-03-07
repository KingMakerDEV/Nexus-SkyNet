from repository.normalized_repo import NormalizedDatasetRepository
from Visualization.chart_analyzer import ChartAnalyzer
from Visualization.chart_formatter import ChartFormatter

class VisualizationService:
    def __init__(self, db):
        self.normalized_repo = NormalizedDatasetRepository(db)
        self.analyzer = ChartAnalyzer()
        self.formatter = ChartFormatter()

    def get_visualization(self, normalized_dataset_id):
        dataset = self.normalized_repo.get_normalized_dataset(normalized_dataset_id)
        if not dataset:
            return {'error': 'Dataset not found'}, 404

        data = dataset.standardized_payload  # list of dicts
        if not data:
            return {'error': 'Empty dataset'}, 400

        chart_type, config = self.analyzer.analyze(data)
        formatted_data = self.formatter.format(data, chart_type, config)

        return {
            'dataset_id': normalized_dataset_id,
            'visualization_type': chart_type,
            'title': self._generate_title(dataset, chart_type),
            'data': formatted_data,
            'axes': config
        }

    def _generate_title(self, dataset, chart_type):
        # Simple title – can be enhanced later
        return f"Dataset {dataset.id} - {chart_type.replace('_', ' ').title()}"