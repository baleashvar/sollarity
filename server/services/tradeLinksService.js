class TradeLinksService {
  constructor() {
    this.solMint = 'So11111111111111111111111111111111112'; // Wrapped SOL
    this.usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
  }

  generateJupiterLink(tokenMint, inputMint = this.solMint) {
    return `https://jup.ag/swap/${inputMint}-${tokenMint}`;
  }

  generateRaydiumLink(tokenMint, inputMint = this.solMint) {
    return `https://raydium.io/swap/?inputMint=${inputMint}&outputMint=${tokenMint}`;
  }

  generateOrcaLink(tokenMint, inputMint = this.solMint) {
    return `https://www.orca.so/swap?tokenIn=${inputMint}&tokenOut=${tokenMint}`;
  }

  generateAllTradeLinks(tokenMint) {
    return {
      jupiter: this.generateJupiterLink(tokenMint),
      raydium: this.generateRaydiumLink(tokenMint),
      orca: this.generateOrcaLink(tokenMint),
      jupiterUSDC: this.generateJupiterLink(tokenMint, this.usdcMint),
      raydiumUSDC: this.generateRaydiumLink(tokenMint, this.usdcMint)
    };
  }

  addTradeLinksToToken(tokenData) {
    return {
      ...tokenData,
      tradeLinks: this.generateAllTradeLinks(tokenData.address)
    };
  }

  addTradeLinksToTokens(tokens) {
    return tokens.map(token => this.addTradeLinksToToken(token));
  }
}

module.exports = new TradeLinksService();