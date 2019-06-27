# Wix-event-wrapper is library that helps managing event listeners in Corvid(Wix Code). 

The library was created because there was no easy way to remove or change event listeners in wixCode, so for example every new $w(selector).onClick(cb), will add new event listener.
# How to use: 
Create file wix-event-wrapper.js in public. Copy code from index.js there.  
`import $e from 'public/wix-event-wrapper.js' `

After importing you can use `$e` object instead of `$w` everywhere. It has same methods and attributes.


```javascript
import $e from 'public/wix-event-wrapper.js';

$.onReady(()=>{
	$e('#myButton').onClick(event=>{console.log('initial')});
	setTimeout(()=>{
		$e('#myButton').onClick(event=>{console.log('Changed')});// After 5 seconds cb function in #myButton will be replaced to this one
	},5000)
	setTimeout(()=>{
		$e('#myButton').onClick(()=>{});// After 10 seconds cb function will be replaced to empty function. Use this way if you want to delete event listener
	},10000);
});
```

# getRepeaterCallbackArguments(repeaterId, event)

```javascript
import $e, { getRepeaterCallbackArguments } from 'public/wix-event-wrapper.js';

$e.onReady(()=>{
	//set initial
	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text1;
	});
	$e('#myButtonInRepeater').onClick(event=>{
		const {$item, itemData, index} = getRepeaterCallbackArguments('#myRepeater',event);
		console.log('initial');
	});
	$e('#myRepeater').data = [{_id: '1' , text1: 'text1', text2: 'text2'}];


	//before running this code #myButtonInRepeater will console.log('initial') for all container elements
	//after it will console.log('changed') for all container elements
	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text2;
	});
	$e('#myButtonInRepeater').onClick(event=>{
		const {$item, itemData, index} = getRepeaterCallbackArguments('#myRepeater',event);
		console.log('changed');
	});
	$e('#myRepeater').data = [...$e('#myRepeater').data, ...[{_id: '2' , text1: 'text1', text2: 'text2'}]];
});

```


# F.A.Q.
##### Can I use both $w and $e in the same file?
-Yes. Wix-event-wrapper doesn't make any changes to `$w` object, so feel free to use both where you want to.
##### Can I use group select `$e('Button')` or multiId select `$e('#myId1, #myId2')` with this library?
- Yes.

##### How Can I remove event listener?
- Just pass empty function as callback 

```
import $e from 'public/wix-event-wrapper.js'

$e.onReady(()=>{
	$e('#myButton').onClick(event=>{
		console.log('changed');
	});
	$e('#myButton').onClick(()=>{});
});
```

##### Can I use `$e` it to get/set attributes and call methods that are not event listener, like `.disabe()`, `.hide()` , `.collapse()` etc?
- Yes. The original attributes/methods will be used under the hood.  

##### Can I use `$e` with repeaters?
- Yes. But I suggest to change your code a little bit(BTW It's not related to this library, it's just more efficient way to use repeater). And here is explanation why onItemReady is tricky

```javascript
import $e from 'public/wix-event-wrapper.js'
//wix-event-wrapper is used
$e.onReady(()=>{
	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text1;
		$item('#myButtonInRepeater').onClick(event=>{
			console.log('initial')
		});
	});
	$e('#myRepeater').data = [{_id: '1' , text1: 'text1', text2: 'text2'}];

	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text2;
		$item('#myButtonInRepeater').onClick(event=>{
			console.log('changed');
		});
	});
	$e('#myRepeater').data = [...$e('#myRepeater').data, ...[{_id: '2' , text1: 'text1', text2: 'text2'}]];
});
```

```javascript
//original $w is used
$w.onReady(()=>{
	$w('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text1;
		$item('#myButtonInRepeater').onClick(event=>{
			console.log('initial')
		});
	});
	$w('#myRepeater').data = [{_id: '1' , text1: 'text1', text2: 'text2'}];

	$w('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text2;
		$item('#myButtonInRepeater').onClick(event=>{
			console.log('changed');
		});
	});
	$w('#myRepeater').data = [...$w('#myRepeater').data, ...[{_id: '2' , text1: 'text1', text2: 'text2'}]];
});
```
https://www.helloworld123321.com/wew-repeater-example

In first case (with wix-event-wrapper).
The result of this code will be.
In second #myTextInRepeater.text = 'text2', onClick will be console.log('changed')
In 1st container of repeater #myTextInRepeater = '#text1' , onClick will be still console.log('initial'), 


In second case (without wix-event-wrapper).
The result of this code will be.
In second #myTextInRepeater.text = 'text2', onClick will be console.log('changed')
In 1st container of repeater #myTextInRepeater = '#text2' , onClick will be both console.log('initial') AND  console.log('changed'), 

Wix-event-wrapper prevented adding of additional event listener to 1st container, so using wix-event-wrapper gives you ability to have different event listeners for different containers. 
It's a rare case scenario, but it's still cool to have this ability.

Anyway I suggest to use different syntax for repeaters, if you just need same eventListener function for all containers, but with different ($item,itemData,index) used in it.

```javascript
import $e, { getRepeaterCallbackArguments } from 'public/wix-event-wrapper.js'

$e.onReady(()=>{
	//set initial
	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text1;
	});
	$e('#myButtonInRepeater').onClick(event=>{
		const {$item, itemData, index} = getRepeaterCallbackArguments('#myRepeater',event);
		console.log('initial');
	});
	$e('#myRepeater').data = [{_id: '1' , text1: 'text1', text2: 'text2'}];
	
	//before running this code #myButtonInRepeater will console.log('initial') for all container elements
	//after it will console.log('changed') for all container elements
	$e('#myRepeater').onItemReady(($item, itemData, index)=>{
		$item('#myTextInRepeater').text = itemData.text2;
	});
	$e('#myButtonInRepeater').onClick(event=>{
		const {$item, itemData, index} = getRepeaterCallbackArguments('#myRepeater',event);
		console.log('changed');
	});
	$e('#myRepeater').data = [...$e('#myRepeater').data, ...[{{_id: '2' , text1: 'text1', text2: 'text2'}}]];
});

```
The idea is to move assigning eventListers from the onItemReady, and use it only to change the view.
Notice the `getRepeaterCallbackArguments` function. It's additional function written exactly for repeater. It accepts 2 arguments: repeaterId and event and returns object with the same params that you would have received using the onItemReady.
This way you will move view logic from the controller logic.