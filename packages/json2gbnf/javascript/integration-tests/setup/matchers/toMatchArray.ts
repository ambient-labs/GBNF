import { expect } from 'vitest';

expect.extend({
  toMatchArray(received, expected) {
    // const { isNot } = this;

    // if (isNot) {
    //   throw new Error('Not implemented');
    // }


    // if (received.mock.calls.length === 0) {
    //   return {
    //     message: () => `Was not called`,
    //     pass: false,
    //   };
    // }
    // if (received.mock.calls.length > 1) {
    //   return {
    //     message: () => `Was called more than once, ${received.mock.calls.length} times, need to update hte matcher`,
    //     pass: false,
    //   };
    // }

    // for (const call of received.mock.calls) {
    //   const arg = call[0];
    //   if (!(arg instanceof Error)) {
    //     console.log(arg.message, arg.name, arg.stack)
    //     return {
    //       message: () => `Was not called with an error: ${arg}`,
    //       pass: false,
    //     };
    //   } else if (isNot) {
    //     return {
    //       message: () => `Was called with an error: ${arg}`,
    //       pass: false,
    //     };
    //   }

    //   if (arg.message !== message) {
    //     return {
    //       message: () => [
    //         `Error message does not match.`,
    //         '',
    //         `Expected: ${message}`,
    //         `Received: ${arg.message}`,
    //       ].join('\n'),
    //       pass: false,
    //     };
    //   } else if (isNot) {
    //     return {
    //       message: () => [
    //         `Error message matches`,
    //         '',
    //         `Message: ${message}`,
    //       ].join('\n'),
    //       pass: false,
    //     };
    //   }

    //   if (arg.name !== type) {
    //     return {
    //       message: () => [
    //         `Error type does not match.`,
    //         '',
    //         `Expected: ${type}`,
    //         `Received: ${arg.name}`,
    //       ].join('\n'),
    //       pass: false,
    //     };
    //   } else if (isNot) {
    //     return {
    //       message: () => [
    //         `Error type matches`,
    //         '',
    //         `Type: ${type}`,
    //       ].join('\n'),
    //       pass: false,
    //     };
    //   }
    // }

    // return {
    //   message: () => `Everything looks good`,
    //   pass: true
    // };
  }
});
