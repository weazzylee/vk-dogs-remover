const { VK } = require('vk-io');
const Jetty = require("jetty");
const fs = require('fs');
const _ = require('lodash');

//ID группы
const group = 0
//Access token для авторизации !!!!с правами 'groups'!!!!
const token = 'AccessToken'

const vk = new VK({
	token: token
});
const tty = new Jetty(process.stdout);

var templateStorage = {
    totalCount: 0,
    usersReceived: 0,
    dogsCount: 0,
    users: []
};

var tempUsers = [];
var tempDogs = [];

async function usersFetch() {
    const collectStream = vk.collect.groups.getMembers({
	    group_id: group, fields: 'deactivated', parallelCount: 2
	});
    
    collectStream.on('error', console.error);
    
    collectStream.on('data', ({ total, percent, received, items }) => {
        if(templateStorage.totalCount == 0)
            templateStorage.totalCount = total
        
        templateStorage.usersReceived = received
        tempUsers = _.concat(tempUsers, items)
        tempDogs = _.concat(tempDogs, _.filter(items, 'deactivated'))
        templateStorage.dogsCount = tempDogs.length
        tty.clear();
        tty.moveTo([0,0]);
        tty.text('🔍 Загрузка всех пользователей из группы\n\n🗃️ Готово: '+received+' из '+total+' ['+percent+'%]\n');
    });
    
    collectStream.on('end', () => {
        tty.clear();
        tty.moveTo([0,0]);
        tty.text('\n✨ Все пользователи загружены\n✨ Пользователей всего: '+tempUsers.length+'\n✨ Собак: '+tempDogs.length+'\n');
        if(usersFile = templateStorage)
        {
            usersFile.users = tempUsers;
            fs.writeFile('./users.json', JSON.stringify(usersFile), 'utf-8', function(err) {
                if (err) throw err
                tty.text('\n✨ Все пользователи выгружены -> users.json\n');
            })
        }
        if(dogsFile = templateStorage)
        {
            dogsFile.users = tempDogs;
            fs.writeFile('./dogs.json', JSON.stringify(dogsFile), 'utf-8', function(err) {
                if (err) throw err
                tty.text('\n✨ Собаки выгружены -> dogs.json\n');
                deleteDogs()
            })
        }
    });
}

async function deleteDogs() {
    mappedDogsFile       = templateStorage
    mappedDogs           = _.map(tempDogs, (dog) => { return { group_id: group, user_id: dog.id } })
    mappedDogsFile.users = mappedDogs
    fs.writeFile('./mappedDogs.json', JSON.stringify(mappedDogsFile), 'utf-8', function(err) {
        if (err) throw err
        tty.text('\n✨ Отформатированные собаки -> mappedDogs.json\n');
        tty.text('\n✨ Происходит удаление '+(mappedDogs.length > 10000 ? '10.000' : mappedDogs.length)+' пользователей.\n'+(mappedDogs.length > 10000 ? '(10.000 - лимит удаления пользователей в день для «Администратора»)\n' : ''));
        vk.collect.executes('groups.removeUser', _.slice(mappedDogs, 0, 10000)).then(console.log).catch(console.error)
    })
}

usersFetch().catch(console.error);