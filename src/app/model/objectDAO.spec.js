import { fireDataBase } from './objectDAO';

describe('tests fireBase class', () => {
    beforeEach(() => {
        const dbMock = {
            ref: () => dbMock,
            update: () => dbMock,
            once: (val, callback) => {
                const args = [dbMock, dbMock];
                args.val = () => 1;
                callback(args);
            },
            val: () => 1,
            child: () => dbMock,
            remove: () => null
        };
        fireDataBase.db = dbMock;
    });
    it('should call update on setTask', () => {
        const task = { id: 1, category: 'work', isDone: false };

        const updates = {};
        updates[`/tasks/${task.id}`] = task;

        spyOn(fireDataBase.db, 'ref').and.callThrough();
        spyOn(fireDataBase.db, 'update').and.callThrough();

        fireDataBase.setTask(task.id, task);

        expect(fireDataBase.db.ref().update).toHaveBeenCalledWith(updates);
    });

    it('should call remove on right child on deleteTask', () => {
        const task = { id: 1, category: 'work', isDone: false };

        spyOn(fireDataBase.db, 'ref').and.callThrough();
        spyOn(fireDataBase.db, 'child').and.callThrough();
        spyOn(fireDataBase.db, 'remove');

        fireDataBase.deleteTask(task.id);

        expect(fireDataBase.db.ref().child).toHaveBeenCalledWith(`/tasks/${task.id}`);
        expect(fireDataBase.db.ref().remove).toHaveBeenCalled();
    });

    it('should return promise on getTask', () => {
        spyOn(fireDataBase.db, 'ref').and.callThrough();
        spyOn(fireDataBase.db, 'once').and.callThrough();

        const task = { id: 1, category: 'work', isDone: false };

        fireDataBase.getTask(task.id);
        expect(fireDataBase.db.once).toHaveBeenCalled();
    });
});
