import { mockDatabase, MockProduct } from '../data/fssaiMockData';

/**
 * Simulates fetching a product from the backend database by its name.
 * In a real application, this would be an HTTP request to a server.
 * @param productName The name of the product to search for.
 * @returns A Promise that resolves to the product data or null if not found.
 */
export const findProductByName = (productName: string): Promise<MockProduct | null> => {
  console.log(`Simulating backend search for: ${productName}`);
  
  return new Promise(resolve => {
    // Simulate network latency
    setTimeout(() => {
      const result = mockDatabase.find(product => 
        product.name.toLowerCase().includes(productName.toLowerCase())
      );
      resolve(result || null);
    }, 500); // 500ms delay
  });
};

/**
 * Simulates fetching products by category.
 * @param category The category to filter by.
 * @returns A Promise that resolves to an array of products.
 */
export const findProductsByCategory = (category: MockProduct['category']): Promise<MockProduct[]> => {
    console.log(`Simulating backend fetch for category: ${category}`);

    return new Promise(resolve => {
        setTimeout(() => {
            const results = mockDatabase.filter(product => product.category === category);
            resolve(results);
        }, 500);
    });
};
