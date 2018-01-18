import * as firebase from 'firebase';
/**
 * @module FireDataBase
 */
const config = {
    apiKey: 'AIzaSyDAVyZSAr-P27GGa0tS0Fl-scYXbyV4pNY',
    authDomain: 'pomodoro-b5405.firebaseapp.com',
    databaseURL: 'https://pomodoro-b5405.firebaseio.com',
    projectId: 'pomodoro-b5405',
    storageBucket: 'pomodoro-b5405.appspot.com',
    messagingSenderId: '518914091874'
};
/** Class with firebase operations  */
class FireBase {
    constructor (fbConfig) {
        firebase.initializeApp(fbConfig);

        this.db = firebase.database();
    }
    /**
     * set a task to firebase
     * @param {object} task
     */
    setTask (task) {
        const updates = {};
        updates[`/tasks/${task.id}`] = task;

        this.db.ref().update(updates);
    }
    /**
     * delets the task with given id
     * @param {String} taskId
     */
    deleteTask (taskId) {
        console.log(taskId);
        const temp = this.db.ref().child(`/tasks/${taskId}`);
        temp.remove();
        console.log(temp);
    }
    /**
     * gets all tasks in the firebase
     * @returns {Promice}
     */
    async getTasks () {
        const tasks = [];

        await this.db.ref('tasks/').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                tasks.push(childSnapshot.val());
            });
        });

        return tasks;
    }

    /**
     * get specific task
     * @param {String} id
     * @returns {object}
     */
    getTask (id) {
        return this.db.ref(`tasks/${id}`).once('value', snapshot => snapshot.val());
    }
}

export const fireDataBase = new FireBase(config);
