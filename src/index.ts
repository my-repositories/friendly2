import '~/core';
import '~/handlers';
import { IoC } from './ioc/container';
import { Main } from './main';

const main = IoC.instance.resolve(Main);

main.run();
