#!/usr/bin/env python3
"""
Sollarity Data Pipeline Runner

This script runs the complete data pipeline:
1. Scrape memecoin data
2. Analyze the data
3. Update the database

Usage:
    python run_pipeline.py --limit 100 --days 7
"""

import os
import sys
import argparse
import asyncio
import logging
from datetime import datetime

# Import our modules
from scraper import MemeScanner
from analyzer import MemeAnalyzer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("pipeline.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("pipeline_runner")

async def run_pipeline(limit=100, days=7):
    start_time = datetime.now()
    logger.info(f"Starting data pipeline at {start_time}")
    
    try:
        # Step 1: Run the scraper
        logger.info("Starting data scraping...")
        scanner = MemeScanner()
        scrape_results = await scanner.run(limit)
        logger.info(f"Scraping completed. Processed {len(scrape_results)} tokens")
        
        # Step 2: Run the analyzer
        logger.info("Starting data analysis...")
        analyzer = MemeAnalyzer()
        analysis_results = analyzer.run(days)
        
        if analysis_results:
            logger.info("Analysis completed successfully")
            
            # Log summary
            scams = len(analysis_results.get('scams', []))
            trending = len(analysis_results.get('trending', []))
            safe = len(analysis_results.get('safe', []))
            
            logger.info(f"Analysis summary: {scams} potential scams, {trending} trending coins, {safe} safe investments")
        else:
            logger.error("Analysis failed")
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"Pipeline completed in {duration:.2f} seconds")
        
        return True
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Run the Sollarity data pipeline")
    parser.add_argument("--limit", type=int, default=100, help="Number of tokens to scrape")
    parser.add_argument("--days", type=int, default=7, help="Days of historical data to analyze")
    args = parser.parse_args()
    
    asyncio.run(run_pipeline(args.limit, args.days))

if __name__ == "__main__":
    main()