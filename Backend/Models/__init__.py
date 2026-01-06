
from Backend.Models.users import User
from Backend.Models.normalized_dataset import NormalizedDataset
from Backend.Models.metadata import DatasetMetadata
from Backend.Models.raw_dataset import RawDataset

# Optional: create a list of all models for easy iteration
ALL_MODELS = [
    User,
    RawDataset,
    NormalizedDataset,
    DatasetMetadata,
]
