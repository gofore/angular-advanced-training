# E2E Testing
- What is it?
- Technologies
- Page objects
- Promise manager
- Chrome Headless
- Different philosophies

---
# What Is It?
- End to End testing
- Tests the system as whole by simulating user interaction via the browser
- Can verify that the DOM looks like it should
- Usually just the "happy paths" 

---
# Technologies used
- Protractor
- Any browser supported by Protractor (Chrome by default)
- Jasmine for test case declaration and expectations

---
# Protractor
- E2E test framework originally made for Angular.js
- Runs tests in supported browsers
- Automatically waits for all pending tasks (HTTP requests, timers) on Angular
- Based on WebDriver and thus Selenium

---
# Protractor - Example
```typescript
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});
```

---
# Page Objects
Page object encapsulates the page access
```typescript
import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
```

---
# Corresponding Test
```typescript
import { AppPage } from './app.po';

describe('koulutus App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
```

---
# Debugging
- Pausing for debugging
- Sleep
- Interactive mode
- Screenshots

---
# Promise Manager
- The promises are queued by default 
- Leads to odd behavior:
```typescript
it('should find an element by text input model', function() {
    browser.get('app/index.html#/form');
    
    var username = element(by.model('username'));
    username.clear();
    username.sendKeys('Jane Doe');
    
    var name = element(by.binding('username'));
    
    expect(name.getText()).toEqual('Jane Doe');
    
    // Point A
});
```
- Disabled in upcoming Selenium 4.0

---
# Async/await Without Promise Manager 
```typescript
it('should find an element by text input model', function() {
    await browser.get('app/index.html#/form');
    
    var username = await element(by.model('username'));
    await username.clear();
    await username.sendKeys('Jane Doe');
    
    var name = await element(by.binding('username'));
    
    await expect(name.getText()).toEqual('Jane Doe');
    
    // Point A
});
```

---
# Turning Promise Manager Off
_protractor.conf.js_:
```javascript
exports.config = {
  ...,
  SELENIUM_PROMISE_MANAGER: false
};

```


---
# Different Approaches
Test philosophies:
- Just the UI
- Full system
- Something in the middle

---
# Just the UI
Pros:
- Fast
- No random failures

Cons:
- Only assesses the UI
- Requires a lot of mocking

---
# Full System
Pros:
- Proves that actual system works as intended

Cons:
- Random failures
- Take lots of time
- How to handle external services such as email sending?

---
# Learnt in Practice
- Use Chrome Headless for running (easy installation and repetition)
- Use Chrome or screenshots for debugging
- Use Docker (constant environment)
- Only fail after N failures
- Run every N minutes or on each commit (depending on E2E test duration etc.)
- Incremental tests instead of reset between each test file

---
# Chrome Headless
- Chrome without window -> can be ran from command line
- Supports DOM manipulation, JS execution, screenshots, PDF printing etc. 
- Support in Chrome 59 (Linux & Mac OS X) and 60 (Windows)
- Modern day PhantomJS

---
# Chrome Headless & Protractor
_protractor.conf.js_:
```javascript
exports.config = {
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': [
            '--disable-gpu',
            '--headless',
            '--window-size=1280,1696'
          ]
        }
    },
    directConnect: true
};
```

---
# Pitfalls
- Intervals in Angular code 
- Managing login