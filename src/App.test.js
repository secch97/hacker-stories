describe('Something truthy and falsy', () => { 
  test('True to be true', () => { 
    expect(true).toBeTruthy(); 
  });

  test("false to be false", () => {
    expect(false).toBeFalsy();
  });
 });
