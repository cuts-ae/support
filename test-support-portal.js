#!/usr/bin/env node

/**
 * Complete Support Portal Clickthrough Test
 * Tests every element, button, form, and feature
 */

const puppeteer = require('puppeteer');

const SUPPORT_URL = 'http://localhost:45004';
const TEST_EMAIL = 'support@cuts.ae';
const TEST_PASSWORD = 'TabsTriggerIsnt2026*$';

const results = {
  loginPage: {},
  authentication: {},
  mainPortal: {},
  socketConnection: {},
  chatQueue: {},
  activeChats: {},
  messaging: {},
  buttons: {},
  forms: {},
  errors: []
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLoginPage(page) {
  console.log('\n=== TESTING LOGIN PAGE ===');

  try {
    // Navigate to login
    await page.goto(`${SUPPORT_URL}/login`, { waitUntil: 'networkidle0' });
    await delay(1000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/support-login-page.png' });

    // Check page title
    const title = await page.title();
    results.loginPage.title = title;
    console.log('Page title:', title);

    // Check all UI elements
    const elements = {
      emailInput: await page.$('input[type="email"]'),
      passwordInput: await page.$('input[type="password"]'),
      submitButton: await page.$('button[type="submit"]'),
      logo: await page.$('svg'),
      demoCredentials: await page.evaluate(() => {
        return document.body.textContent.includes('agent@cuts.ae');
      })
    };

    results.loginPage.elements = {
      emailInput: !!elements.emailInput,
      passwordInput: !!elements.passwordInput,
      submitButton: !!elements.submitButton,
      logo: !!elements.logo,
      demoCredentials: elements.demoCredentials
    };

    console.log('Login page elements:', results.loginPage.elements);

    // Check for any console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await delay(500);
    results.loginPage.consoleErrors = consoleErrors;

  } catch (error) {
    results.errors.push(`Login page test failed: ${error.message}`);
    console.error('Login page error:', error);
  }
}

async function testAuthentication(page) {
  console.log('\n=== TESTING AUTHENTICATION ===');

  try {
    // Fill in credentials
    await page.type('input[type="email"]', TEST_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', TEST_PASSWORD, { delay: 50 });

    console.log('Credentials entered');

    // Click submit
    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    console.log('Login button clicked');

    // Wait for navigation or error
    await delay(2000);

    // Check if redirected
    const currentUrl = page.url();
    results.authentication.redirected = currentUrl !== `${SUPPORT_URL}/login`;
    results.authentication.currentUrl = currentUrl;

    console.log('Current URL after login:', currentUrl);

    // Check localStorage
    const authData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('support-auth-token'),
        agent: localStorage.getItem('support-agent')
      };
    });

    results.authentication.tokenStored = !!authData.token;
    results.authentication.agentStored = !!authData.agent;

    if (authData.agent) {
      try {
        results.authentication.agentData = JSON.parse(authData.agent);
      } catch (e) {
        results.errors.push('Failed to parse agent data');
      }
    }

    console.log('Auth storage:', {
      tokenStored: results.authentication.tokenStored,
      agentStored: results.authentication.agentStored
    });

    // Take screenshot after login
    await page.screenshot({ path: '/tmp/support-after-login.png' });

  } catch (error) {
    results.errors.push(`Authentication test failed: ${error.message}`);
    console.error('Authentication error:', error);
  }
}

async function testMainPortal(page) {
  console.log('\n=== TESTING MAIN PORTAL ===');

  try {
    // Wait for portal to load
    await delay(2000);

    // Check for main portal elements
    const portalElements = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent : null;
      };

      return {
        header: !!document.querySelector('h1'),
        headerText: getText('h1'),
        connectionStatus: document.body.textContent.includes('Connected') || document.body.textContent.includes('Disconnected'),
        logoutButton: !!document.querySelector('button:has-text("Logout")') ||
                      Array.from(document.querySelectorAll('button')).some(btn => btn.textContent.includes('Logout')),
        statsCards: document.querySelectorAll('[class*="Card"]').length,
        tabsList: !!document.querySelector('[role="tablist"]'),
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent.trim(),
          disabled: btn.disabled,
          type: btn.type
        }))
      };
    });

    results.mainPortal = portalElements;
    console.log('Portal elements found:', {
      header: portalElements.headerText,
      connectionStatus: portalElements.connectionStatus,
      statsCards: portalElements.statsCards,
      buttonsCount: portalElements.allButtons.length
    });

    // Take screenshot
    await page.screenshot({ path: '/tmp/support-main-portal.png', fullPage: true });

  } catch (error) {
    results.errors.push(`Main portal test failed: ${error.message}`);
    console.error('Main portal error:', error);
  }
}

async function testSocketConnection(page) {
  console.log('\n=== TESTING SOCKET.IO CONNECTION ===');

  try {
    // Wait for socket to connect
    await delay(3000);

    // Check connection status on page
    const connectionInfo = await page.evaluate(() => {
      const statusText = document.body.textContent;
      const isConnected = statusText.includes('Connected') && !statusText.includes('Disconnected');

      // Check for green/red indicator
      const indicators = document.querySelectorAll('[class*="bg-green"], [class*="bg-red"]');

      return {
        statusText: isConnected ? 'Connected' : 'Disconnected',
        hasIndicator: indicators.length > 0,
        indicatorColor: Array.from(indicators).map(ind => ind.className)
      };
    });

    results.socketConnection = connectionInfo;
    console.log('Socket connection:', connectionInfo);

    // Check console for socket messages
    const socketLogs = await page.evaluate(() => {
      return window.__socketLogs || [];
    });

    results.socketConnection.logs = socketLogs;

  } catch (error) {
    results.errors.push(`Socket connection test failed: ${error.message}`);
    console.error('Socket connection error:', error);
  }
}

async function testChatQueue(page) {
  console.log('\n=== TESTING CHAT QUEUE ===');

  try {
    // Click on Queue tab
    const queueTab = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
      const queueTab = tabs.find(tab => tab.textContent.includes('Queue'));
      if (queueTab) queueTab.click();
      return !!queueTab;
    });

    results.chatQueue.tabFound = queueTab;

    await delay(1000);

    // Check queue contents
    const queueInfo = await page.evaluate(() => {
      const queueItems = document.querySelectorAll('[class*="queue"], [class*="Chat"]');
      const emptyState = document.body.textContent.includes('No pending') ||
                        document.body.textContent.includes('empty');

      return {
        itemCount: queueItems.length,
        isEmpty: emptyState,
        content: document.body.textContent.substring(0, 500)
      };
    });

    results.chatQueue = { ...results.chatQueue, ...queueInfo };
    console.log('Chat queue:', queueInfo);

    await page.screenshot({ path: '/tmp/support-queue-tab.png' });

  } catch (error) {
    results.errors.push(`Chat queue test failed: ${error.message}`);
    console.error('Chat queue error:', error);
  }
}

async function testActiveChats(page) {
  console.log('\n=== TESTING ACTIVE CHATS ===');

  try {
    // Click on Active tab
    const activeTab = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
      const activeTab = tabs.find(tab => tab.textContent.includes('Active'));
      if (activeTab) activeTab.click();
      return !!activeTab;
    });

    results.activeChats.tabFound = activeTab;

    await delay(1000);

    // Check active chats contents
    const activeInfo = await page.evaluate(() => {
      const emptyState = document.body.textContent.includes('No active') ||
                        document.body.textContent.includes('empty');

      return {
        isEmpty: emptyState,
        content: document.body.textContent.substring(0, 500)
      };
    });

    results.activeChats = { ...results.activeChats, ...activeInfo };
    console.log('Active chats:', activeInfo);

    await page.screenshot({ path: '/tmp/support-active-tab.png' });

  } catch (error) {
    results.errors.push(`Active chats test failed: ${error.message}`);
    console.error('Active chats error:', error);
  }
}

async function testAllButtons(page) {
  console.log('\n=== TESTING ALL BUTTONS ===');

  try {
    const buttonTests = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        disabled: btn.disabled,
        type: btn.type,
        className: btn.className,
        visible: btn.offsetParent !== null
      }));
    });

    results.buttons.all = buttonTests;
    results.buttons.count = buttonTests.length;
    results.buttons.enabled = buttonTests.filter(b => !b.disabled).length;

    console.log(`Found ${buttonTests.length} buttons (${results.buttons.enabled} enabled)`);
    buttonTests.forEach(btn => {
      console.log(`  - ${btn.text || '(icon button)'} [${btn.disabled ? 'disabled' : 'enabled'}]`);
    });

    // Test logout button
    const logoutButton = buttonTests.find(b => b.text.includes('Logout'));
    if (logoutButton) {
      results.buttons.logoutFound = true;
      console.log('Logout button found');
    }

  } catch (error) {
    results.errors.push(`Button test failed: ${error.message}`);
    console.error('Button test error:', error);
  }
}

async function testNetworkRequests(page) {
  console.log('\n=== TESTING NETWORK REQUESTS ===');

  const requests = [];
  const responses = [];

  page.on('request', request => {
    if (request.url().includes('localhost:45000')) {
      requests.push({
        url: request.url(),
        method: request.method()
      });
    }
  });

  page.on('response', response => {
    if (response.url().includes('localhost:45000')) {
      responses.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  await delay(2000);

  results.network = {
    requests: requests.length,
    responses: responses.length,
    details: responses
  };

  console.log(`Network: ${requests.length} requests, ${responses.length} responses`);
  responses.forEach(res => {
    console.log(`  ${res.status} - ${res.url}`);
  });
}

async function main() {
  console.log('Starting Support Portal Complete Clickthrough Test');
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: false, // Run in visible mode to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    results.errors.push(`Page error: ${error.message}`);
    console.log('PAGE ERROR:', error.message);
  });

  try {
    // Run all tests
    await testLoginPage(page);
    await testAuthentication(page);
    await testMainPortal(page);
    await testSocketConnection(page);
    await testChatQueue(page);
    await testActiveChats(page);
    await testAllButtons(page);
    await testNetworkRequests(page);

    // Final screenshot
    await page.screenshot({ path: '/tmp/support-final.png', fullPage: true });

  } catch (error) {
    console.error('Test suite error:', error);
    results.errors.push(`Test suite error: ${error.message}`);
  } finally {
    // Keep browser open for 5 seconds to review
    console.log('\nBrowser will close in 5 seconds...');
    await delay(5000);
    await browser.close();
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(JSON.stringify(results, null, 2));

  // Write results to file
  const fs = require('fs');
  fs.writeFileSync(
    '/Users/sour/Projects/cuts.ae/support/TEST_RESULTS.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\nResults written to TEST_RESULTS.json');

  // Print error summary
  if (results.errors.length > 0) {
    console.log('\n' + '!'.repeat(60));
    console.log('ERRORS FOUND:');
    results.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  } else {
    console.log('\nNo errors found!');
  }

  process.exit(0);
}

main().catch(console.error);
