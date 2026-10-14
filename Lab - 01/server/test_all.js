async function runAllTests() {
    console.log("=== STARTING FULL API TEST SUITE ===\n");

    try {
        // 1. Test Registration
        console.log("1. Testing Registration (POST /customers/register)");
        const testUser = {
            fullName: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "password123",
            phone: "1234567890"
        };
        const regRes = await fetch('http://localhost:1974/customers/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log("Status:", regRes.status, regRes.status === 201 ? "✅ PASSED" : "❌ FAILED");
        if (regRes.status !== 201) console.log("Response:", regData);

        // 2. Test Login
        console.log("\n2. Testing Login (POST /customers/login)");
        const loginRes = await fetch('http://localhost:1974/customers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const loginData = await loginRes.json();
        console.log("Status:", loginRes.status, loginRes.status === 200 ? "✅ PASSED" : "❌ FAILED");
        if (loginRes.status !== 200) console.log("Response:", loginData);

        // 3. Test Create Product (Task 2)
        console.log("\n3. Testing Create Product (POST /products/create)");
        const prodRes = await fetch('http://localhost:1974/products/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Headphones",
                description: "Wireless over-ear headphones.",
                price: 4999,
                category: "Audio",
                image: "https://example.com/headphones.jpg",
                stock: 25
            })
        });
        const prodData = await prodRes.json();
        console.log("Status:", prodRes.status, prodRes.status === 201 ? "✅ PASSED" : "❌ FAILED");
        if (prodRes.status !== 201) console.log("Response:", prodData);
        
        let createdProductId = prodData._id;

        // 4. Test Get All Products (Task 3)
        console.log("\n4. Testing Get All Products (GET /products/all)");
        const allRes = await fetch('http://localhost:1974/products/all');
        const allData = await allRes.json();
        console.log("Status:", allRes.status, (allRes.status === 200 && allData.success) ? "✅ PASSED" : "❌ FAILED");
        console.log("Count found:", allData.count);

        // 5. Test Search & Category Filtering (Task 5)
        console.log("\n5. Testing Search & Category Filtering (GET /products/all?search=head&category=Audio)");
        const filterRes = await fetch('http://localhost:1974/products/all?search=head&category=Audio');
        const filterData = await filterRes.json();
        console.log("Status:", filterRes.status, (filterRes.status === 200 && filterData.count >= 1) ? "✅ PASSED" : "❌ FAILED");

        // 6. Test Single Product (Task 4)
        console.log("\n6. Testing Single Product (GET /products/:id)");
        if (createdProductId) {
            const singleRes = await fetch(`http://localhost:1974/products/${createdProductId}`);
            const singleData = await singleRes.json();
            console.log("Status:", singleRes.status, singleRes.status === 200 ? "✅ PASSED" : "❌ FAILED");
            console.log("Retrieved Product Name:", singleData.name);
        } else {
            console.log("❌ SKIPPED: No product ID available from creation step");
        }

    } catch (e) {
        console.error("Test execution failed:", e);
    }
    
    console.log("\n=== TEST SUITE FINISHED ===");
}

runAllTests();
