@echo off
echo Running Sollarity Data Pipeline...

cd workers
python run_pipeline.py --limit 100 --days 7

echo Done!
pause