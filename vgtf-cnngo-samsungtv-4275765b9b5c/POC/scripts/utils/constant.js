'use strict';

app.factory('CONSTANT', function () {
    var ITEM = {
        loaded: false
    };

    return {
        ITEM: ITEM,
        ITEMS: [ITEM, ITEM, ITEM, ITEM],
        CATEGORY: {
            COLORS: 0,
            ALPHABETS: 1,
            NUMBERS: 2,
            RELATED_PLAY_LIST: 3
        },
        EFFECT_DELAY_TIME: 500,
        SCROLL_HEIGHT_OF_INDEX: 297, //269, //369, 265+28
        MEDIA_CONTROLLER_TIMEOUT: 3500,
        KEY_CODE: {
            RETURN: 10009,
            ESC: 27
        },
        /*
        CLASS_NAMES: {
            BTN: '.btn',
            BTN_PLAY: '.btn-play',
            BTN_RESUME: '.btn-resume',
            BTN_RESTART: '.btn-restart',
            BTN_ADD_MY_TALKS: '.btn-add-talks',
            BTN_REMOVE_MY_TALKS: '.btn-remove-talks',
            BTN_PLAYER_MY_TALKS: '.player_talks',
            BTN_PLAYER_MY_TALKS_ACTIVE: '.player_talks_active',
            BTN_ABOUT_SPEAKER: '.btn-about-speaker',
            BTN_ABOUT_TALK: '.btn-about-talk',
            VIDEO_INFORMATION: '.video-information',
            CONTROLS_BAR: '.controls-bar',
            SUBTITLE_BOTTOM: 'subtitle-bottom',
            SUBTITLE_MID: 'subtitle-mid',
            SUBTITLE: '#subtitle'
        },*/
        PREPARED_DATA: {
            COLORS: [
                {
                    headline: 'Trump camp seizes on latest leaked Clinton emails',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_0',
                    name: 'RED color',
                    duration: '02:03',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160922134912-06-trump-clinton-split-0921-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(255, 0, 0, .3)'
                },
                {
                	headline: 'Trump boasts of freedom from GOP in epic Tweetstorm',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_1',
                    name: 'BLUE color',
                    duration: '01:39',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161010103343-donald-trump-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(0, 0, 255, .3)'
                },
                {
                	headline: 'Obama weighs in on Trump tape: That\'s not right',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011184510-obama-trump-tape-reax-hillary-clinton-nc-rally-sot-00010518-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Syrian child cries for father after airstrikes',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011102324-aya3-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Galaxy Note 7 is dead',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011183810-samsung-galaxy-note-7-dead-dnt-hancocks-00002705-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'US vows action against email hacks',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/140806080947-cyber-attack-file-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Landslide pummels town',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929113421-china-landslides-typhoon-megi-orig-00002421-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Big Papi reflects on his career, thanks fans',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011114254-david-ortiz-big-papi-red-sox-retirement-bts-00001826-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                }
            ],
            ALPHABETS: [
                {
                	headline: 'Trump campaign manager stumped in interview',
                    description: 'This is alphabet description.',
                    id: 'alphabet_0',
                    name: 'Alphabet A',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011234116-cooper-conway-clinton-lawsuits-guilt-cnn-intv-00010014-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(200, 191, 231, .3)'
                },
                {
                	headline: 'Donald Trump\'s comments about daughter raise eyebrows',
                    description: 'This is alphabet description.',
                    id: 'alphabet_1',
                    name: 'Alphabet B',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161012102650-ivanka-sits-on-trump-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(200, 191, 231, .3)'
                },
                {
                	headline: 'Debate parodies read lips and sing duets',
                    description: 'This is alphabet description.',
                    id: 'alphabet_2',
                    name: 'Alphabet C',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161009232848-debate-trump-clinton-3-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(200, 191, 231, .3)'
                },
                {
                	headline: 'Scott Baio: Offended by Trump\'s language? Grow up',
                    description: 'This is alphabet description.',
                    id: 'alphabet_3',
                    name: 'Alphabet D',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011144024-scott-baio-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(78, 84, 129, .3)'
                },
                {
                	headline: 'Former politician cites Beyoncé to criticize Clinton',
                    description: 'This is alphabet description.',
                    id: 'alphabet_4',
                    name: 'Alphabet E',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160828170442-beyonce-vmas-2016-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(78, 84, 129, .3)'
                },
                {
                	headline: 'President Obama loves science',
                    description: 'This is alphabet description.',
                    id: 'alphabet_5',
                    name: 'Alphabet F',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/120207084603-obama-marshmallow-cannon-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(78, 84, 129, .3)'
                },
                {
                	headline: 'Khloe Kardashian: Kim\'s not doing well',
                    description: 'This is alphabet description.',
                    id: 'alphabet_6',
                    name: 'Alphabet G',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011094535-khloe-kardashian-ellen-degeneres-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(63, 72, 204, .3)'
                },
                {
                	headline: 'Glenn Beck considered voting for Hillary Clinton',
                    description: 'This is alphabet description.',
                    id: 'alphabet_7',
                    name: 'Alphabet H',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '240x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/161011134036-glenn-beck-file-video-synd-2.jpg'
                        }
                    ],
                    color: 'rgba(63, 72, 204, .3)'
                }
            ],
            NUMBERS: [
				{
                    headline: 'Abbas, Netanyahu shake hands at service',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_0',
                    name: 'RED color',
                    duration: '02:03',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160930050702-peres-funeral-abbas-netanyahu-handshake-super-169.jpg'
                        }
                    ],
                    color: 'rgba(255, 0, 0, .3)'
                },
                {
                	headline: 'Train crashes in Hoboken, New Jersey',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_1',
                    name: 'BLUE color',
                    duration: '01:39',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929101117-10-new-jersey-hoboken-transit-super-169.jpg'
                        }
                    ],
                    color: 'rgba(0, 0, 255, .3)'
                },
                {
                	headline: 'Sources: Bomb suspect possibly took train to NY',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929184402-ny-bomb-suspect-ahmad-rahami-train-perez-tsr-sot-00001005-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Gary Johnson unable to name world leader he admires',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160908132559-gary-johnson-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Syria: 5-year-old rescued from collapsed building',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929114511-syria-aleppo-rescue-00015004-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Sources: Bomb suspect possibly took train to NY',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929184402-ny-bomb-suspect-ahmad-rahami-train-perez-tsr-sot-00001005-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Landslide pummels town',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160929113421-china-landslides-typhoon-megi-orig-00002421-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                },
                {
                	headline: 'Ohio prosecutors are fighting back against heroin',
                	description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',  
                    name: 'BROWN color',
                    duration: '03:55',
                    photo_urls: [
                        {
                            size: '320x180',
                            url: 'http://dynaimage.cdn.turner.com/prod-papi/cnnnext/dam/assets/org/160426124048-dangerous-painkillers-super-169.jpg'
                        }
                    ],
                    color: 'rgba(165, 42, 24, .3)'
                }
                
            ]
        }
    };
});