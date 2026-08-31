# Instructions for Creating a Test Case

## File Naming Convention

- Name your test file as: `ComponentName.test.tsx`

## Import Order for Test Files

Follow this exact order for imports to maintain consistency and readability:

1. **Testing libraries** (with a blank line after):

   ```typescript
   import { describe, test, expect, beforeEach } from 'vitest';
   import userEvent from '@testing-library/user-event';
   import { renderWithProviders, screen, waitFor } from 'tests/tests.util';
   ```

2. **Third-party libraries**:

   ```typescript
   import AxiosMockAdapter from 'axios-mock-adapter';
   ```

3. **Core modules**:

   ```typescript
   import { Axios } from 'core/http';
   import Config from 'core/configs/data.json';
   import { MAPPING_FRAMEWORK_STATUS } from 'core/base/enum';
   ```

4. **Local modules** (with a blank line after):
   ```typescript
   import ComponentName from './ComponentName';
   ```

## Test Case Fundamentals

### General Rules

- Use `async` and `await` properly for asynchronous operations
- Do not use `async` in a test function unless you use `await` inside it
- **Avoid using type `any`**: Always use specific types to ensure type safety
  and clarity
- Each test case first letter should be capitalized
- Clean up after tests - React Testing Library automatically cleans up the DOM
  after each test
- **Do not use `toHaveStyle` in test cases and do not test any custom style.**
  Focus only on component behavior and output.

### Focus on Functionality

- **Avoid style tests**:
- Do not include tests that check for specific styles or CSS properties (e.g.,
  `toHaveStyle`, `customStyle`)
- Focus on component behavior and output instead of visual presentation
- Write test cases that specifically target the behavior and functionality of
  the component under test

## Query Guidelines

### Prefer Accessibility-Focused Queries

Use queries in this order of preference:

1. **`getByRole`** - Best for interactive elements
2. **`getByLabelText`** - For form elements with labels
3. **`getByText`** - For elements based on visible text content

### Asynchronous Queries

- **Prefer `findBy` over `waitFor`**: Use `findBy` for asynchronous queries
  instead of wrapping assertions in `waitFor`

## Function Naming and Mocking

### Mock Function Convention

- Use descriptive names for functions
- For mock implementations, prefix with `onMock`
- **Declare each mock function only once** to maintain clarity and avoid
  confusion

Example:

```typescript
const onMockClick = vi.fn(); // ✅ Declared only once
// In props:
onClick: onMockClick,
```

### Simulating Click Events

To simulate a click event in your tests, always use the following code with the
`import userEvent from '@testing-library/user-event'` third-party library:

```typescript
userEvent.click(buttonElement);
```

Use only this approach for simulating click events.

### Mock Function Best Practices

- Avoid multiple test cases with the same mock function unless necessary
- Reset mocks in `beforeEach` if needed across multiple tests

Example structure:

```typescript
describe('Button Component', () => {
  const onMockClick = vi.fn(); // Declare only once

  beforeEach(() => {
    onMockClick.mockClear(); // Reset before each test
  });

  test('Handles click event correctly', () => {
    renderWithProviders(
      <Button onClick={onMockClick}>Clickable Button</Button>
    );

    const buttonElement = screen.getByRole('button', {
      name: 'Clickable Button',
    });
    userEvent.click(buttonElement);

    expect(onMockClick).toHaveBeenCalledTimes(1);
  });
});
```

## User Interaction Testing

### Click Events

**Always use `userEvent.click(element)`** to simulate click events - this
accurately reflects user interactions.

**Avoid native click methods:**

```typescript
// ❌ Don't use these
element.click();
const user = userEvent.setup();
user.click(buttonElement as Element);

// ✅ Use this instead
userEvent.click(element);
```

## Important Testing Guidelines

# Do not Mock child components

# Do not Mock the Redux store state , useAppDispatch and Slice

# Instructions for Test Case for asserting attribute

## "MANDATORY PATTERNS"

- **Focus on Variants**: In variant test cases, concentrate only on asserting
  the expected attributes or property and avoid additional checks that may not
  be relevant or accessible.

EX: expect(badgeElement).toHaveProperty('variant', 'Success');

**Important:**

- Do not assert on the presence of CSS classes or styles and customStyles.
- Always check for the correct attribute or property value inside the shadow
  DOM.
- Do not use queries like `getByTestId` or test for the existence of the web
  component only—assert on its attributes or property for variant testing.
- **Use `toHaveProperty` for asserting object properties in test cases.**
  - Example: `expect(badgeElement).toHaveProperty('variant', 'Success');`
  - Only use for checking attributes or properties, not styles or classes.
- NEVER use `toHaveStyle` or test custom styles.
- Use accessibility-focused queries for other elements when possible.

**Important:** Do not test for CSS classes or styles. Only assert on attributes
and text content within the shadow DOM. **Do not use `toHaveStyle` in test cases
and do not test any custom style.**

## API Testing

### Mock Setup

# Mock API endpoints, not Redux hooks and useAppDispatch and not Slice

```typescript
const axiosMock = new AxiosMockAdapter(Axios);

const mockApiCalls = () => {
  axiosMock
    .onGet(`${Config.USERS}/${Config.MAPPING_GROUPS}`)
    .reply(HTTP_STATUS_CODES.SUCCESS, []);
};
```

### API Error Testing (MANDATORY)

# If component using <ApiError>

```typescript
test('Displays error state', async () => {
  mockApiError(); // Simulate API error
  render(<ComponentName />);

  expect(screen.getByText('Connection Problem')).toBeInTheDocument();
  expect(
    screen.getByText('We were not able to get any data.')
  ).toBeInTheDocument();
  expect(
    screen.getByText('Please try again in a few minutes.')
  ).toBeInTheDocument();
});
```

## Required Test Cases

### 1. Render Without Crashing

Always include this basic test case:

```typescript
describe('ComponentName Test Cases', () => {
  test('Renders component without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByText('Some text')).toBeInTheDocument(); // Check for text content only
  });
});
```

**Important**: Focus solely on text content, not CSS class names or query
selectors. **Do not use `toHaveStyle` in test cases and do not test any custom
style.**

### 2. Loading State Test (MANDATORY)

If the component includes a loader, test the loading behavior:

```typescript
test('Should display loader when data is being fetched', () => {
  render(<ComponentName />);
  expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
});
```

**Important**: Only check for the loader label, not the loader component itself.

### 3. Error Handling Test (MANDATORY)

If the component handles API errors, verify error message display:

```typescript
test('Should display error message on API error', async () => {
  mockApiError();
  render(<ComponentName />);

  expect(screen.getByText('Connection Problem')).toBeInTheDocument();
});
```

## Final Checklist

# Before submitting test code:

- [ ] Remove all unused imports and variables
- [ ] Ensure all test names are descriptive and capitalized
- [ ] Verify no style-related tests are included
- [ ] Confirm proper use of accessibility-focused queries
- [ ] Check that mock functions are declared only once
- [ ] Validate that `userEvent.click()` is used for interactions
- [ ] Do not use `toHaveStyle` in test cases and do not test any custom style
- [] Do not mock Redux store

## Common Anti-Patterns to Avoid

❌ **Don't do:**

- Test styles or custom style or CSS properties
- Use `toHaveStyle` in test cases
- Use `getByTestId` unnecessarily
- Mock Redux Store , useAppDispatch and Slice
- Mock child components
- Use native click methods
- Declare duplicate mock functions
- Use `async` without `await`
- Add type `any`
- Use unnecessary `as HTMLElement` type assertions

✅ **Do:**

- Remove all unused imports and variables
- Remove mocking child components
- Test the basic render, Loading and Error cases.
- Focus on functionality and behavior
- Use accessibility-focused queries
- Test user interactions realistically
- Write descriptive test names
- Clean up properly after tests
- Follow the established import order

# Removed ALL Inappropriate Mocks:

❌ Removed Redux Mocks:

EX: No more mocking of useAppDispatch No more mocking of Redux store state Let
the real Redux store handle state management

❌ Removed Child Component Mocks:

# Instructions for Running ESLint and Tests

## ESLint Commands

### For GitHub Copilot Agent Integration

When you need to run ESLint or suggest fixes, provide the following commands
that can be executed in the VS Code terminal:

**Run ESLint with automatic fixes:**

```bash
npx eslint src --ext .ts,.tsx --fix
```

**Run specific test file:**

```bash
npm run test ComponentName.test.tsx
```
