# About

`pg-ninja-library` is a **Node.js** library for creating a workspace for a **PostgreSQL** project.

## pg-ninja-library for study

+ Create a base of SQL queries and work with it using internal queries and transactions.
+ Execute queries and transactions by adding only binds to them. 
+ The request can be changed in one place, without worrying about all the places where it is executed.
+ Use the workspace to teach students more easily and improve the efficiency of writing code. Including a lightweight syntax will reduce the amount of code for processing requests at times.

# Navigation

- [installation](#installation)
- **usage**:
    - [create workspace](#init-workspace)
    - [using in project](#production)

## Installation

---

```
$ npm i pg-ninja-library
```

# usage

## init workspace

```
const workspace = library(sql_queries_set: Object, connection: Object);
```

`sql_queries_set` - Object with key-value SQL queries

`connection` - PostgreSQL connection object from `pg-ninja`

## setup workspace

## `./workspace/dataset/sql.js`:

create SQL queries Object

```
const sql = {
    user: {
        info: 'SELECT * FROM users WHERE id = $1;',
        get_all: 'SELECT * FROM users;',
    },
    bank: {
        send_money: [
            'UPDATE bank SET balance = balance - $2 WHERE user_id = $1;',
            'UPDATE bank SET balance = balance + $2 WHERE user_id = $2;',
            "INSERT INTO transactions (transaction_type, from_user_id, to_user_id, amount) VALUES ('transfer', $1, $2, $3)",
        ]
    }
};

export default sql;
``` 

## `./workspace/init.js`:

import libraries

```
import library from 'pg-ninja-library';
import { PG_Ninja } from 'pg-ninja-library';
import sql_dataset from './dataset/sql.js';
```

create PostgreSQL connection

```
const connection = new PG_Ninja({
    connectionString: process.env.PG_CONNECTION
});
```

create workspace

```
const workspace = new library(sql_dataset, connection);
```

export workspace

```
export default workspace;
```

---

## Production

Now we have everything for start work with our workspace, so let's imagine, which functionality I can prepare depends on these SQL queries.

1. `workspace.user.info`

user's account info <br>
we can use it fo user's perconal account for show information

## `account.js`:

```
import workspace from './workspace/init.js';

...

workspace.user.info.query([user_id]).then(res => {
    // res.rows[0] - all account info
}, err => {
    // some kind of error (?)
});

...

```

2. `workspace.user.get_all`:

may be helpful for statics, for data analytics, for business plans
so let's make it more usefull with create Excel table from this script

```
import workspace from './workspace/init.js';

workspace.user.get_all.query().then(res => {
    res.to_excel('./reports/');
}, err => {});
```

3. `workspace.bank.send_money`:

so, I have the bank app and wanna create transfer function, but I must save data constistence.
if **user1** don't have enough money all next queries must be blocked.

How can I do it?

```
import workspace from './workspace/init.js';

...

workspace.bank.send_money.transaction([
    [5432, 200], // minus 200 dollars from user[id=5432]
    [2799, 200], // plus 200 dollars for user[id=2799]
    [5432, 2799, 200], // create transaction record about this operation really existed
]).then(res => {
    // we guaranteed all query procceded correctly
}, err => {
    // so now it's error, maybe not enough money or user[id=2799] have been blocked and deleted
});

...

```
