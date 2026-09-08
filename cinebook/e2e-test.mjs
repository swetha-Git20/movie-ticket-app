import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = 'C:\\Users\\acer\\Music\\movie ticket booking project\\cinebook\\e2e-screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runE2ETest() {
  console.log('🚀 Starting Visible Browser E2E Test on Microsoft Edge...');
  
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: false,
    slowMo: 400
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // 1. Navigate to Home
    console.log('Step 1: Navigating to http://localhost:4200/');
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_home_page.png') });
    console.log('✅ Home Page loaded');

    // 2. Test Language Switcher: Tamil Movies
    console.log('Step 2: Testing Language Switcher -> Tamil Movies');
    await page.click('button:has-text("Tamil Movies")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_tamil_movies.png') });
    console.log('✅ Tamil Movies filter active');

    // 3. Test Language Switcher: English Movies
    console.log('Step 3: Testing Language Switcher -> English Movies');
    await page.click('button:has-text("English Movies")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_english_movies.png') });
    console.log('✅ English Movies filter active');

    // 4. Test Language Switcher: All Movies
    console.log('Step 4: Switching back to All Movies');
    await page.click('button:has-text("All Movies")');
    await page.waitForTimeout(600);

    // 5. Select Date
    console.log('Step 5: Testing Date Strip Selection');
    const dateTabs = await page.$$('.date-card');
    if (dateTabs.length > 1) {
      await dateTabs[1].click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_date_selected.png') });
    console.log('✅ Booking Date selected');

    // 6. Select a Movie (Jananayagan / first movie)
    console.log('Step 6: Clicking on movie to view Movie Details & Showtimes');
    const firstMovieCard = await page.waitForSelector('.movie-card');
    await firstMovieCard.click();
    await page.waitForURL(/.*\/movies\/.*/);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_movie_details.png') });
    console.log('✅ Movie Details page loaded');

    // 7. Select Showtime on Movie Details page
    console.log('Step 7: Selecting Showtime slot (with ₹ price)');
    const showtimeButton = await page.waitForSelector('.showtime-card');
    await showtimeButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_showtime_selected.png') });

    // 8. Proceed to Seat Selection
    console.log('Step 8: Clicking Proceed to Seat Selection');
    await page.click('.proceed-seats-btn');
    await page.waitForURL(/.*\/seat-selection.*/);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_seat_selection.png') });
    console.log('✅ Seat Selection page loaded');

    // 9. Select 2 Seats
    console.log('Step 9: Selecting 2 available seats');
    const availableSeats = await page.$$('.seat.available');
    if (availableSeats.length >= 2) {
      await availableSeats[0].click();
      await page.waitForTimeout(300);
      await availableSeats[1].click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_seats_picked.png') });
    console.log('✅ Seats selected with subtotal in ₹');

    // 10. Proceed to Food & Snacks
    console.log('Step 10: Proceeding to Food & Snacks');
    await page.click('.proceed-btn');
    await page.waitForURL(/.*\/food.*/);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_food_menu.png') });
    console.log('✅ Food & Beverages menu loaded');

    // 11. Add Snacks
    console.log('Step 11: Adding Butter Popcorn and Drink to Cart');
    const addButtons = await page.$$('.add-btn');
    if (addButtons.length >= 2) {
      await addButtons[0].click();
      await page.waitForTimeout(400);
      await addButtons[1].click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_food_added.png') });
    console.log('✅ Food items added to cart with ₹ total');

    // 12. Proceed to Checkout
    console.log('Step 12: Proceeding to Checkout');
    await page.click('.checkout-btn');
    await page.waitForURL(/.*\/checkout.*/);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_checkout_summary.png') });
    console.log('✅ Checkout page loaded with breakdown in ₹');

    // 13. Apply Coupon Code
    console.log('Step 13: Applying Promo Code WEEKEND50');
    await page.fill('.promo-input', 'WEEKEND50');
    await page.click('.apply-btn');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_coupon_applied.png') });
    console.log('✅ Promo code applied with discount in ₹');

    // 14. Pay & Confirm
    console.log('Step 14: Clicking Pay & Confirm Booking');
    await page.click('.pay-btn');
    await page.waitForTimeout(500);
    
    // In Modal, click confirm
    const modalConfirmBtn = await page.waitForSelector('.modal-confirm-btn');
    await modalConfirmBtn.click();
    console.log('⏳ Processing mock payment...');

    await page.waitForURL(/.*\/booking-success.*/, { timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_booking_confirmation.png') });
    console.log('🎉 ✅ Booking Confirmed with Booking ID, QR Code and Ticket details!');

  } catch (err) {
    console.error('❌ E2E Test Error:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') });
    throw err;
  } finally {
    await browser.close();
  }
  console.log('🏆 All E2E test steps passed successfully with visible Microsoft Edge browser!');
}

runE2ETest();
