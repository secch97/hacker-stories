describe('Something truthy and falsy', () => { 
  test('True to be true', () => { 
    expect(true).toBe(true); 
  });

  test("false to be false", () => {
    expect(false).toBe(true);
  });
 });
