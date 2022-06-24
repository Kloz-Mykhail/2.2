import fetch from 'node-fetch';

async function getId(output?: (ip: string) => void): Promise<string> {
  const resp = await fetch('https://api.ipify.org?format=json');
  const data: { ip: string } = await resp.json();
  if (output) output(data.ip);
  return data.ip;
}

function get(
  field: string,
  from: string,
  output?: (name: string) => void
): Promise<string> {
  return new Promise((resp) => {
    fetch(from)
      .then((res) => res.json())
      .then((result) => {
        if (output) output(result[field]);
        return resp(result[field]);
      });
  });
}

async function getAsync(
  field: string,
  url: string,
  output?: (data: string) => void
): Promise<string> {
  const resp = await fetch(url);
  const data = await resp.json();
  if (output) output(data[field]);
  return data[field];
}

function getField(field: string, times: number) {
  for (let index = 0; index < times; index++) {
    get(field, 'https://random-data-api.com/api/name/random_name').then(
      (resp) => {
        console.log(resp);
      }
    );
  }
}
async function asyncGetRandomNames(
  times: number,
  output?: (name: string[]) => void
) {
  const array = new Array(times);
  for (let index = 0; index < array.length; index++) {
    array[index] = await getAsync(
      'name',
      'https://random-data-api.com/api/name/random_name'
    );
  }
  if (output) output(array);
  return array;
}

function getFemaleUser() {
  get('gender', 'https://random-data-api.com/api/users/random_user').then(
    (gender) => {
      if (gender !== 'Female') getFemaleUser();
      else console.log('!!!found');
    }
  );
}

async function asyncGetFemaleUser() {
  const gender = await getAsync(
    'gender',
    'https://random-data-api.com/api/users/random_user'
  );
  if (gender !== 'Female') asyncGetFemaleUser();
  else console.log('!!!found');
}
getId((ip) => console.log(ip));
getField('name', 3);
asyncGetRandomNames(3, (arr) => arr.forEach((el) => console.log(el)));
Promise.all([
  get('name', 'https://random-data-api.com/api/name/random_name'),
  get('name', 'https://random-data-api.com/api/name/random_name'),
  get('name', 'https://random-data-api.com/api/name/random_name'),
]).then((arr) => arr.forEach((el) => console.log(el)));
getFemaleUser();
asyncGetFemaleUser();

function first(callback: (ip: string) => void) {
  fetch('https://api.ipify.org?format=json')
    .then((resp) => resp.json())
    .then((json) => callback(json.ip));
}
async function second() {
  first((ip) => console.log(ip));
}

second();

function sec(callback: (ip: string) => void) {
  getId().then((ip) => callback(ip));
}
sec((ip) => console.log(ip));
