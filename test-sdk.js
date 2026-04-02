#!/usr/bin/env node

/**
 * Test script for Great Humans TypeScript SDK
 * 
 * Acest script testează funcționalitatea SDK-ului după compilare
 */

const path = require('path');

// Adaugă dist/ la module path
process.env.NODE_PATH = path.resolve(__dirname, 'dist') + (process.env.NODE_PATH ? ':' + process.env.NODE_PATH : '');

try {
  // Importă SDK-ul compilat
  const agents = require('./dist/agents.js');
  
  const {
    listAgents,
    getAgentById,
    getAgentByRank,
    listAgentsByDomain,
    searchAgentsByName,
    getTopAgents,
    getAgentsStats,
    agentExists,
    rankExists,
    getSystemPromptById
  } = agents;
  
  console.log('🧪 Testing Great Humans TypeScript SDK');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Încărcare agenți
  console.log('\n1. Testing load agents...');
  try {
    const agents = listAgents();
    if (agents.length === 100) {
      console.log('✅ Load agents - PASSED');
      passed++;
    } else {
      console.log(`❌ Load agents - FAILED (expected 100, got ${agents.length})`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Load agents - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 2: Găsește agent după ID
  console.log('\n2. Testing getAgentById...');
  try {
    const muhammad = getAgentById('hart-001-muhammad');
    if (muhammad && muhammad.name === 'Muhammad') {
      console.log('✅ Get agent by ID - PASSED');
      passed++;
    } else {
      console.log('❌ Get agent by ID - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Get agent by ID - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 3: Găsește agent după rank
  console.log('\n3. Testing getAgentByRank...');
  try {
    const newton = getAgentByRank(2);
    if (newton && newton.name === 'Isaac Newton') {
      console.log('✅ Get agent by rank - PASSED');
      passed++;
    } else {
      console.log('❌ Get agent by rank - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Get agent by rank - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 4: Listează agenți după domeniu
  console.log('\n4. Testing listAgentsByDomain...');
  try {
    const scientists = listAgentsByDomain('science');
    if (scientists.length > 0) {
      console.log(`✅ List agents by domain - PASSED (${scientists.length} scientists)`);
      passed++;
    } else {
      console.log('❌ List agents by domain - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ List agents by domain - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 5: Caută agenți după nume
  console.log('\n5. Testing searchAgentsByName...');
  try {
    const results = searchAgentsByName('Einstein');
    if (results.length > 0 && results[0].name.includes('Einstein')) {
      console.log(`✅ Search agents by name - PASSED (${results.length} results)`);
      passed++;
    } else {
      console.log('❌ Search agents by name - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Search agents by name - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 6: Top agenți
  console.log('\n6. Testing getTopAgents...');
  try {
    const topAgents = getTopAgents(5);
    if (topAgents.length === 5 && topAgents[0].rank === 1) {
      console.log('✅ Get top agents - PASSED');
      passed++;
    } else {
      console.log('❌ Get top agents - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Get top agents - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 7: Statistici
  console.log('\n7. Testing getAgentsStats...');
  try {
    const stats = getAgentsStats();
    if (stats.total === 100 && stats.domains.length > 0) {
      console.log(`✅ Get agents stats - PASSED`);
      console.log(`   Total: ${stats.total}`);
      console.log(`   Domains: ${stats.domains.length}`);
      console.log(`   Eras: ${stats.eras.length}`);
      console.log(`   Regions: ${stats.regions.length}`);
      passed++;
    } else {
      console.log('❌ Get agents stats - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Get agents stats - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 8: Verifică existența
  console.log('\n8. Testing existence checks...');
  try {
    const agentExists1 = agentExists('hart-001-muhammad');
    const agentExists2 = agentExists('non-existent');
    const rankExists1 = rankExists(1);
    const rankExists2 = rankExists(101);
    
    if (agentExists1 && !agentExists2 && rankExists1 && !rankExists2) {
      console.log('✅ Existence checks - PASSED');
      passed++;
    } else {
      console.log('❌ Existence checks - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Existence checks - ERROR: ${error.message}`);
    failed++;
  }
  
  // Test 9: System prompt
  console.log('\n9. Testing getSystemPromptById...');
  try {
    const prompt = getSystemPromptById('hart-001-muhammad');
    if (prompt && prompt.length > 100) {
      console.log(`✅ Get system prompt - PASSED (${prompt.length} characters)`);
      console.log(`   Preview: ${prompt.substring(0, 100)}...`);
      passed++;
    } else {
      console.log('❌ Get system prompt - FAILED');
      failed++;
    }
  } catch (error) {
    console.log(`❌ Get system prompt - ERROR: ${error.message}`);
    failed++;
  }
  
  // Rezultate finale
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests PASSED! TypeScript SDK is working correctly.');
    process.exit(0);
  } else {
    console.log('❌ Some tests FAILED. Please check the implementation.');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Failed to import SDK:', error.message);
  console.error('Make sure the SDK is compiled: npm run build');
  process.exit(1);
}
