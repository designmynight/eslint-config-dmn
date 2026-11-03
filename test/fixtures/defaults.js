try {
    throw new Error('example');
} catch (error) {
    // Legacy lint does not require using a caught exception.
}

while (true) {
    break;
}

if (Date.now()) {
    function inner() {
        return 1;
    }
    inner();
}

export const globalThis = 1;
export class Example {
    ['method']() {
        return this;
    }
}
