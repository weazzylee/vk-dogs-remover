<center><h1> VK Dogs Remover </h1></center>

Данный скрипт позволяет быстро посчитать, и удалить "собак" (Удаленный или заблокированных пользователей) из группы ВК. Максимально в день можно удалить 10.000 "собак". (Ограничение ВК)

Для доступа к VK Api, я использовал библиотеку [vk-io](https://github.com/negezor/vk-io).

#### Установка

```
git clone https://github.com/weazzylee/vk-dogs-remover.git
cd vk-dogs-remover
npm install
```

#### Использование
Открыть файл index.js, и изменить Access Token на свой, полученный при помощи Implicit Flow:
```
const token = 'accessToken'
```
Как получить Access Token можно прочитать в официальной документации [VK Documentation](https://vk.com/dev/implicit_flow_user).

После указать id группы(Позитивное,целое число, НЕ СТРОКА):
```
const group = 0
```


После всех действий выше просто запускаем:
```
npm run start
```
Либо:
```
node .
```

Связь со мной: [Sergiusz Biełoziorow (vk.com/leecorp)](https://vk.com/leecorp)