jsoToReact
==================================================
для записи шаблонов не использая jsx используется формат описания jso
формат полносью совместим с js, имеет более компактный вид чем jsx

Пример использования
--------------------------------------
```js
var jsoToReact = require('jsoToReact');
var bem = require('bem-name');

var jr = jsoToReact;
var b = bem('page-buy-vip-price');
var t = getText;

{
    render: function() {
        ...

        function Price() {
            return [b('content')
                , [b('column', '-a')
                    , [b('header', '-advantages')
                        , t('premiumAdvantages.title')
                    ]
                    , [{
                        class: cmps.PremiumAdvantages,
                        mix: b('advantages'),
                        ...
                    }]
                ]
                , [b('+h3.column', '-b') // <h3 class="page-buy-vip-price__column -b">
                    , [b('header', '-choice')  // <div class="page-buy-vip-price__header -choice">
                        , ...
                        , t('premium.chooseSubscribtionPlan')
                    ]
                    , jr.map(subscriptionTypes, function(type, index) {  // Array.map
                        return {
                            class: cmps.PremiumPlan,
                            key: type.id,
                            ...
                        };
                    })
                ]
            ];
        };

        return jr([
            {
                class: cmps.PaymentPage,
                tabs: this.props.tabs,
                step: this.props.step,

                productType: this.props.productType,
                boxOnBack: this.props.goBack,
                boxTitle: null,
                ...
            }
            , (hasPremium
                ? [b('content')
                    ,  [b('+h2.header')
                        , t('premiumAdvantages.title')
                    ]
                    ,  {
                        class: cmps.PremiumAdvantages,
                        mix: b('advantages'),
                        ...
                    }
                ]
                : Price()
            )

            , jr.children(this) // {this.props.children}
        ]);
    },
}

```

