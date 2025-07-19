#!/usr/bin/env python3
"""
Sollarity - Task Scheduler
This script schedules and runs the scraper and analyzer at regular intervals.
"""

import os
import time
import logging
import schedule
import subprocess
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scheduler.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('sollarity-scheduler')

def run_scraper():
    """Run the scraper script"""
    logger.info("Starting scraper job")
    try:
        # Use the Python executable from the virtual environment
        python_executable = os.path.join(os.path.dirname(__file__), 'venv', 'Scripts', 'python.exe') \
            if os.name == 'nt' else os.path.join(os.path.dirname(__file__), 'venv', 'bin', 'python')
        
        if not os.path.exists(python_executable):
            logger.warning(f"Virtual environment Python not found at {python_executable}, falling back to system Python")
            python_executable = 'python'
            
        result = subprocess.run(
            [python_executable, "scraper.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"Scraper completed successfully: {result.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Scraper failed with error: {e.stderr}")
    except Exception as e:
        logger.error(f"Error running scraper: {str(e)}")

def run_analyzer():
    """Run the analyzer script"""
    logger.info("Starting analyzer job")
    try:
        # Use the Python executable from the virtual environment
        python_executable = os.path.join(os.path.dirname(__file__), 'venv', 'Scripts', 'python.exe') \
            if os.name == 'nt' else os.path.join(os.path.dirname(__file__), 'venv', 'bin', 'python')
        
        if not os.path.exists(python_executable):
            logger.warning(f"Virtual environment Python not found at {python_executable}, falling back to system Python")
            python_executable = 'python'
            
        result = subprocess.run(
            [python_executable, "analyzer.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"Analyzer completed successfully: {result.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Analyzer failed with error: {e.stderr}")
    except Exception as e:
        logger.error(f"Error running analyzer: {str(e)}")

def main():
    """Main function to set up and run the scheduler"""
    logger.info("Starting Sollarity scheduler")
    
    # Schedule scraper to run every 15 minutes
    schedule.every(15).minutes.do(run_scraper)
    
    # Schedule analyzer to run every 30 minutes
    schedule.every(30).minutes.do(run_analyzer)
    
    # Run both immediately on startup
    run_scraper()
    run_analyzer()
    
    # Keep the scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user")
    except Exception as e:
        logger.error(f"Scheduler crashed: {str(e)}")
        raise