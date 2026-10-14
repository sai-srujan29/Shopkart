

async function testApi() {
    try {
        const response = await fetch('http://localhost:1974/products/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Mechanical Keyboard",
                description: "RGB mechanical keyboard with blue switches.",
                price: 2999,
                category: "Electronics",
                image: "https://example.com/keyboard.jpg",
                stock: 10
            })
        });

        const data = await response.json();
        console.log("Valid Product Response Status:", response.status);
        console.log("Valid Product Response Data:", data);

        const invalidResponse = await fetch('http://localhost:1974/products/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Bad Product",
                price: -10,
                stock: -5
            })
        });

        const invalidData = await invalidResponse.json();
        console.log("Invalid Product Response Status:", invalidResponse.status);
        console.log("Invalid Product Response Data:", invalidData);
        
    } catch (e) {
        console.error("Test failed", e);
    }
}

testApi();
