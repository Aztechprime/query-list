import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure astronomers can register and record observations",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const astronomer = accounts.get('wallet_1')!;

    // Register astronomer
    let block = chain.mineBlock([
      Tx.contractCall('celestial-query-list', 'register-astronomer', 
        [types.utf8('StarObserver')], 
        astronomer.address
      )
    ]);

    // Check registration success
    assertEquals(block.receipts[0].result, '(ok true)');

    // Record an observation
    block = chain.mineBlock([
      Tx.contractCall('celestial-query-list', 'record-observation', [
        types.utf8('Andromeda Galaxy'),
        types.utf8('Galaxy'),
        types.utf8('00h 42m 44.3s'),
        types.utf8('+41° 16\' 09"'),
        types.utf8('Atacama Desert'),
        types.utf8('Excellent'),
        types.utf8('Clear Skies'),
        types.utf8('8" Telescope'),
        types.utf8('Observation notes'),
        types.none()
      ], astronomer.address)
    ]);

    // Check observation recording success
    assertEquals(block.receipts[0].result.expectOk(), '1');
  }
});