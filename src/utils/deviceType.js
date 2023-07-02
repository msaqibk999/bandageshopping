export const detectDeviceType = () =>
window.screen.width <= 910
    ? 'Mobile'
    : 'Desktop';