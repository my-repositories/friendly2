import '~/core';
import '~/handlers';
import { IoC } from './ioc/container';
import { Main } from './main';

(async (main) => {
    main.init();
    main.loadLinks();
    main.tryToFollowOnProfile();
    await main.tryToFollowOnFollowersList();
    await main.openNextLink();
})(IoC.instance.resolve(Main));
