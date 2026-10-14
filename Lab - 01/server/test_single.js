async function testSingleProductApi() {
    try {
        // Fetch all products first to get a valid ID
        const allRes = await fetch('http://localhost:1974/products');
        const allData = await allRes.json();
        
        if (!allData.success || allData.products.length === 0) {
            console.log("No products found to test with.");
            return;
        }

        const validId = allData.products[0]._id;

        // Test valid ID
        const validRes = await fetch(`http://localhost:1974/products/${validId}`);
        const validData = await validRes.json();
        console.log("Valid ID Response Status:", validRes.status);
        console.log("Valid ID Response Data:", validData);

        // Test invalid ID format
        const invalidIdRes = await fetch('http://localhost:1974/products/invalid123');
        const invalidIdData = await invalidIdRes.json();
        console.log("Invalid ID Format Response Status:", invalidIdRes.status);
        console.log("Invalid ID Format Response Data:", invalidIdData);

        // Test non-existent ID
        const fakeId = "5f9d8b123456789012345678";
        const notFoundRes = await fetch(`http://localhost:1974/products/${fakeId}`);
        const notFoundData = await notFoundRes.json();
        console.log("Not Found Response Status:", notFoundRes.status);
        console.log("Not Found Response Data:", notFoundData);

    } catch (e) {
        console.error("Test failed", e);
    }
}

testSingleProductApi();
