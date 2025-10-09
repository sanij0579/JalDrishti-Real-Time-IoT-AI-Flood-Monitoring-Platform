# rainfall/load_csv.py
import os
import sys
from pathlib import Path
import pandas as pd
import django

# Add project root to Python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(PROJECT_ROOT))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rainfall.models import RainfallData

# Load CSV relative to this script
csv_path = Path(__file__).parent / 'rainfall.csv'

if not csv_path.exists():
    raise FileNotFoundError(f"CSV file not found at {csv_path}")

df = pd.read_csv(csv_path)

# Insert or update each row in DB
for index, row in df.iterrows():
    RainfallData.objects.update_or_create(
        year=row['Year'],
        defaults={
            'jan': row['Jan'],
            'feb': row['Feb'],
            'mar': row['Mar'],
            'apr': row['April'],
            'may': row['May'],
            'june': row['June'],
            'july': row['July'],
            'aug': row['Aug'],
            'sept': row['Sept'],
            'oct': row['Oct'],
            'nov': row['Nov'],
            'dec': row['Dec'],
            'total': row['Total'],
        }
    )

print("CSV data loaded successfully!")