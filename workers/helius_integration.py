import requests
import os
from dotenv import load_dotenv

load_dotenv('../config/.env')

def get_token_holders(token_address):
    """Get accurate holder count using Helius API"""
    try:
        # You would need to add HELIUS_API_KEY to .env
        helius_key = os.getenv('HELIUS_API_KEY')
        if not helius_key:
            return None
            
        url = f"https://api.helius.xyz/v0/token-metadata"
        params = {
            'api-key': helius_key,
            'mint': token_address
        }
        
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('holderCount', 0)
    except:
        pass
    return None

def get_lp_burn_status(token_address):
    """Check LP burn status using on-chain data"""
    try:
        # This would require analyzing the token's liquidity pool
        # and checking if LP tokens are burned (sent to null address)
        rpc_url = os.getenv('SOLANA_RPC_URL')
        
        # Placeholder implementation
        # Real implementation would:
        # 1. Find the token's main liquidity pools
        # 2. Check if LP tokens are burned
        # 3. Return True/False based on burn status
        
        return True  # Placeholder
    except:
        pass
    return False

def get_risk_factors(token_address, token_data):
    """Calculate risk factors based on on-chain data"""
    risk_factors = []
    risk_score = 0
    
    # Low liquidity risk
    if token_data.get('liquidityUSD', 0) < 100000:
        risk_factors.append({
            'severity': 'medium',
            'description': 'Low liquidity (< $100k)'
        })
        risk_score += 0.2
    
    # High volume to market cap ratio
    volume_ratio = token_data.get('volume24h', 0) / max(token_data.get('marketCap', 1), 1)
    if volume_ratio > 0.5:
        risk_factors.append({
            'severity': 'medium', 
            'description': 'High trading volume relative to market cap'
        })
        risk_score += 0.1
    
    # LP not burned
    if not token_data.get('lpBurned', False):
        risk_factors.append({
            'severity': 'high',
            'description': 'Liquidity provider tokens not burned'
        })
        risk_score += 0.3
    
    # Low holder count
    if token_data.get('holderCount', 0) < 1000:
        risk_factors.append({
            'severity': 'medium',
            'description': 'Low number of token holders'
        })
        risk_score += 0.15
    
    return {
        'riskFactors': risk_factors,
        'scamProbability': min(risk_score, 1.0)
    }