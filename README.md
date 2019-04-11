# timing-helper
Wrapper for timing navigation api v1

### Example of using
```js
document.addEventListener('load', onLoadHandler);

const onLoadHandler = () => {
    // gather after all other onload handlers have fired
    setTimeout(() => {
        const times = TimingHelper(window);
        console.log(times);
    }, 0);
}
```
