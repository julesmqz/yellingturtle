#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var config = require('../config.js');
var Crawler = require('../Classes/Crawler.js');

amqp.connect(config.rabbitmq.url, function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = config.rabbitmq.queues.simple;

		ch.assertQueue(q, {
			durable: false
		});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);


		ch.consume(q, function(msg) {
			var wait = true;
			console.log(" [x] Received %s", msg.content.toString());
			var data = JSON.parse(msg.content.toString());
			var crawler = new Crawler();

			crawler.crawl(data.url,data.jobId, function(res) {
				console.log('CRAWLED', res.status,res.url);
			});


		}, {
			noAck: true
		});
	});
});