---
layout: post
title: L'autre sommeil - Webpage
author: Michael Kittenberger
thumbnail: thumb_lautresommeil_01.jpg
description: L'autre sommeil - Webpage development backend and frontend.
---

# I am pleased to announce the release of a very nice webpage project I worked on this summer.

The library 'L'autre sommeil' situated in the most famous city of Bécherel hired me to develop their webpage. I was challenged with the front end and back end development.

[See the webpage online](http://www.lautresommeil.com "L'autre sommeil webpage"){:target="_blank"}

<img class="free-image" style="float: right" src="{{site.baseurl}}/assets/img/posts/lautresommeil_01.jpg" width="150" alt="Logo lautre sommeil">
What is so famous about this city, besides that it's an [charming medieval town](http://www.brittanytourism.com/discover-our-destinations/rennes-and-brittany-s-historic-gateways/unmissable-sites/becherel "Information about Bécherel"){:target="_blank"} is that there are more than fifteen bookstores for around 660 inhabitants.

Although nearly all of the libraries there are antiquarian bookshops and this one is as well. L'autre sommeil is specialized in contemporary art, rare and original editions, first editions, in art theory, literary essays and other curiosities.

# Design:
The owners wanted a simple but elegant layout mixed with some interactivity in the form of transparent overlays for the book presentation and a banner slider to show the library and other prettinesses of their shop and the environment.

The result looks like this:

![Screenshot l'autre sommeil 01]({{site.baseurl}}/assets/img/posts/lautresommeil_shreenshot_01.jpg "Screenshot 1"){:class="free-image"}
![Screenshot l'autre sommeil 02]({{site.baseurl}}/assets/img/posts/lautresommeil_shreenshot_02.jpg "Screenshot 2"){:class="free-image"}
![Screenshot l'autre sommeil 03]({{site.baseurl}}/assets/img/posts/lautresommeil_shreenshot_03.jpg "Screenshot 3"){:class="free-image"}
![Screenshot l'autre sommeil 04]({{site.baseurl}}/assets/img/posts/lautresommeil_shreenshot_04.jpg "Screenshot 4"){:class="free-image"}
![Screenshot l'autre sommeil 05]({{site.baseurl}}/assets/img/posts/lautresommeil_shreenshot_fullPage_02.jpg "Screenshot 5"){:class="free-image"}

# Development front end:

Standard schematic HTML with CSS3 styling. The page is responsive with a minimum of media queries. The responsiveness is mostly archived with the flexbox layout.
For the Flickr style layout books presentation I used this [light plugin](https://goodies.pixabay.com/jquery/flex-images/demo.html) (FlexImages)

Normally I prefer VanillaJS but hence this plugin already uses jquery - I might as well use jquery for the simple banner animation.
Why not only css animations? -> because we wanted the banner responsive full width with a max. height and a single interval css property animation seemed to me more neat than to juggle with three different css classes added and removed.

# Development back end:

The owners wanted to have full control over all texts that are not a form. They wanted full control as well over all the book and banner images, alt tags , descriptions, keywords, figure texts and titles etc.

So which CMS to choose?

Actually only a few hours before I've got the call for this project I read an article about [processwire](https://processwire.com/){:target="_blank"}. I took this as a sign.

> A friendly and powerful open source CMS with an exceptionally strong API.

Surly learning a new CMS (or a CMF in this case) takes some additional time. But I was curious and I don't regret it. Absolutely.

The above mentioned citation taken from the processwire site is not a lie.

This CMF gives a lot of freedom and cuts down all restrictions one can find in Content Management Systems.

The documentation is well done and the community extremely helpful.

I tracked the development time, and to learn to use and to develop with this new CMS added approximately 30 hours to my overall time investment for this project, and now I have a new tool in my pocket and whenever possible I will use it. I am really happy with it.

As well the training for the client, how to use it, was a smooth process. We spent about two hours with coffee breaks and the client felt comfortable to work with it straight away.

For someone interested, here's a screenshot from the edit homepage back end:

![Screenshot backend l'autre sommeil]({{site.baseurl}}/assets/img/posts/lautresommeil_backend_01.jpg "Screenshot 6"){:class="fullwidth-image-max-size"}

# Summary

I really liked this "summer" project. Making a webpage for someone with a small business and who likes what he/she does and is passionate about it in a domain which is beautiful - is a pleasure.

If it happens that you're around this place, in the region of Brittany in the town of Bécherel, be sure to take a look and step inside an interesting library - you won't regret it.
