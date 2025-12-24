/**
 * MADAGASCAR MALL - Logic Engine
 * Handling Permanent Reviews & Navigation
 */

// 1. DATABASE CONFIGURATION
// To make reviews permanent, sign up at supabase.com (Free) 
// and replace these with your project details.
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// 2. CORE FUNCTIONS
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the reviews page
    if (document.getElementById('reviewWall')) {
        loadPermanentReviews();
    }
});

/**
 * Loads reviews from the database and displays them on the Wall
 */
async function loadPermanentReviews() {
    const wall = document.getElementById('reviewWall');
    
    try {
        // Fetching data from Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const reviews = await response.json();

        // Clear loading state and render
        if (reviews.length > 0) {
            // Keep your static ones or replace entirely:
            const reviewHTML = reviews.map(rev => `
                <div class="review-card">
                    <p class="text-xs font-black uppercase mb-2">${rev.username}</p>
                    <p class="text-base font-light italic leading-relaxed">"${rev.comment}"</p>
                </div>
            `).join('');
            
            // Prepend new reviews to the wall
            wall.innerHTML = reviewHTML + wall.innerHTML;
        }
    } catch (error) {
        console.error("Database connection required for permanent reviews.");
    }
}

/**
 * Submits a new review to the database
 */
async function submitReview() {
    const nameInput = document.getElementById('reviewerName');
    const textInput = document.getElementById('reviewerText');

    if (!nameInput.value || !textInput.value) {
        alert("PLEASE FILL IN BOTH NAME AND MESSAGE.");
        return;
    }

    const newReview = {
        username: nameInput.value.toUpperCase(),
        comment: textInput.value
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(newReview)
        });

        if (response.ok) {
            // Clear inputs and refresh the wall
            nameInput.value = '';
            textInput.value = '';
            location.reload(); // Refresh to show the new permanent review
        }
    } catch (error) {
        alert("ERROR: DATABASE NOT CONNECTED. Review will not be permanent yet.");
    }
}
