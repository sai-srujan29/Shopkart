async function testSearchAPI() {
    try {
        console.log("1. Testing Category: Electronics");
        const catRes = await fetch('http://localhost:1974/products/all?category=Electronics');
        const catData = await catRes.json();
        console.log("Count:", catData.count);

        console.log("\n2. Testing Search: keyboard");
        const searchRes = await fetch('http://localhost:1974/products/all?search=keyboard');
        const searchData = await searchRes.json();
        console.log("Count:", searchData.count);

        console.log("\n3. Testing Combined: search=board & category=Electronics");
        const comboRes = await fetch('http://localhost:1974/products/all?search=board&category=Electronics');
        const comboData = await comboRes.json();
        console.log("Count:", comboData.count);

    } catch (e) {
        console.error("Test failed", e);
    }
}

testSearchAPI();
