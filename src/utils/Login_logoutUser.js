const key = "auth-token"

function setItemWithExpiry(key, value, expirySeconds) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expirySeconds * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export function loginUser(jwtToken) {
  const expiry = 7 * 24 * 60 * 60 * 1000;
  setItemWithExpiry( key , jwtToken, expiry );
}

export function LogOutUser() {
  localStorage.removeItem(key);
  };

export function GetToken() {
  return getItemWithExpiry(key)
}
