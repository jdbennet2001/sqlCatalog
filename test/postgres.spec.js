const {refreshTables} = require('../lib/dataStore')


xdescribe('DB abstraction layer', () => {

    it('can ensure all tables are available', async () => {

        let status = await refreshTables(false);
        expect(status).toBe(true)
    });

 });