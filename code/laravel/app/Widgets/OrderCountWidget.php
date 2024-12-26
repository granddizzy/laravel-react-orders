<?php

namespace App\Widgets;

use App\Models\Order;
use Arrilot\Widgets\AbstractWidget;

class OrderCountWidget extends AbstractWidget
{
    protected $config = [];

    public function run()
    {
        $ordersCount = Order::count();
        $string = "Заказы";

        return view('voyager::dimmer', array_merge($this->config, [
            'icon'   => 'voyager-basket',
            'title' => `{$ordersCount} {$string}`,
            'text' => "Количество заказов: {$ordersCount}",
            'button' => [
                'text' => 'Посмотреть заказы',
                'link' => 'voyager.orders.index',
            ],
            'image' => 'orders.png',
        ]));
    }

    public function shouldBeDisplayed() {
        return true;
    }
}
