export type Quote = {
  id: number;
  reference: string;
  text: string;
  speaker: string;
  recipient: string;
  aliases?: string[];
};

export const quotes: Quote[] = [
  {
    id: 1,
    reference: 'Jeremiah 29:11',
    text: "'I well know the thoughts that I am thinking toward you,' declares Jehovah, 'thoughts of peace, and not of calamity, to give you a future and a hope.'",
    speaker: 'Jehovah',
    recipient: 'Exiled Israelites'
  },
  {
    id: 2,
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    speaker: 'Jesus',
    recipient: 'Nicodemus',
    aliases: ['god']
  },
  {
    id: 3,
    reference: '1 Peter 5:7',
    text: 'Casting all your anxiety on him, because he cares for you.',
    speaker: 'Peter',
    recipient: 'Believers'
  },
  {
    id: 4,
    reference: 'Proverbs 3:6',
    text: 'In all your ways take notice of him, and he will make your paths straight.',
    speaker: 'Solomon',
    recipient: 'Reader'
  },
  {
    id: 5,
    reference: 'Isaiah 54:17',
    text: 'No weapon formed against you will have any effect, and any tongue that rises up against you for judgment, you will prove to be in the wrong.',
    speaker: 'Jehovah',
    recipient: 'Israel'
  },
  {
    id: 6,
    reference: '1 Corinthians 13:4-7',
    text: 'Love is patient and kind. Love is not jealous. It does not brag, does not get puffed up, does not behave indecently, does not look for its own interests, does not become provoked. It does not keep account of the injury. It does not rejoice over unrighteousness, but rejoices with the truth. It bears all things, believes all things, hopes all things, endures all things.',
    speaker: 'Paul',
    recipient: 'Corinthian Church'
  },
  {
    id: 7,
    reference: 'Matthew 28:19',
    text: 'Go, therefore, and make disciples of people of all the nations, baptizing them in the name of the Father and of the Son and of the holy spirit.',
    speaker: 'Jesus',
    recipient: 'Disciples'
  },
  {
    id: 8,
    reference: '2 Timothy 3:16',
    text: 'All Scripture is inspired of God and beneficial for teaching, for reproof, for correction, for training in righteousness.',
    speaker: 'Paul',
    recipient: 'Timothy'
  },
  {
    id: 9,
    reference: 'Galatians 5:23',
    text: 'Meekness, self-control. Against such things there is no law.',
    speaker: 'Paul',
    recipient: 'Galatian Churches'
  },
  {
    id: 10,
    reference: '1 John 1:9',
    text: 'If we confess our sins, he is faithful and righteous so as to forgive us our sins and to cleanse us from all unrighteousness.',
    speaker: 'John',
    recipient: 'Believers'
  },
  {
    id: 11,
    reference: '1 Thessalonians 5:18',
    text: 'In connection with everything, give thanks, for this is what God wills for you in connection with Christ Jesus.',
    speaker: 'Paul',
    recipient: 'Thessalonian Church'
  },
  {
    id: 12,
    reference: 'Ephesians 2:8',
    text: "For by this undeserved kindness you have been saved through faith; and this is not of yourselves, it is God's gift.",
    speaker: 'Paul',
    recipient: 'Ephesian Church'
  },
  {
    id: 13,
    reference: 'Ephesians 6:11',
    text: 'Put on the complete suit of armor from God so that you may be able to stand firm against the crafty acts of the Devil.',
    speaker: 'Paul',
    recipient: 'Ephesian Church'
  },
  {
    id: 14,
    reference: 'Romans 5:8',
    text: 'But God recommends his own love to us in that, while we were yet sinners, Christ died for us.',
    speaker: 'Paul',
    recipient: 'Roman Church'
  },
  {
    id: 15,
    reference: 'Romans 12:2',
    text: 'And stop being molded by the system of things of this world, but be transformed by making your mind over, so that you may prove to yourselves the good and acceptable and perfect will of God.',
    speaker: 'Paul',
    recipient: 'Roman Church'
  },
  {
    id: 16,
    reference: 'Philippians 4:6',
    text: 'Do not be anxious over anything, but in everything by prayer and supplication along with thanksgiving, let your petitions be made known to God.',
    speaker: 'Paul',
    recipient: 'Philippian Church'
  },
  {
    id: 17,
    reference: 'Matthew 6:33',
    text: 'But keep on seeking first the kingdom and his righteousness, and all these other things will be added to you.',
    speaker: 'Jesus',
    recipient: 'Disciples'
  },
  {
    id: 18,
    reference: '2 Timothy 1:7',
    text: 'For God gave us not a spirit of cowardice, but of power and of love and of a sound mind.',
    speaker: 'Paul',
    recipient: 'Timothy'
  },
  {
    id: 19,
    reference: 'Isaiah 41:10',
    text: 'Do not be afraid, for I am with you. Do not be anxious, for I am your God. I will strengthen you, yes, I will help you, yes, I will uphold you with the right hand of my righteousness.',
    speaker: 'Jehovah',
    recipient: 'Israel'
  },
  {
    id: 20,
    reference: '1 Corinthians 10:13',
    text: 'No temptation has come upon you except what is common to men. But God is faithful, and he will not let you be tempted beyond what you can bear. But with the temptation he will also make the way out, so that you may be able to endure it.',
    speaker: 'Paul',
    recipient: 'Corinthian Church'
  },
  {
    id: 21,
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who are toiling and loaded down, and I will refresh you.',
    speaker: 'Jesus',
    recipient: 'All People'
  },
  {
    id: 22,
    reference: 'Matthew 28:20',
    text: 'Teaching them to observe all the things I have commanded you. And look! I am with you all the days until the conclusion of the system of things.',
    speaker: 'Jesus',
    recipient: 'Disciples'
  },
  {
    id: 23,
    reference: '1 Peter 3:15',
    text: 'Rather, sanctify the Christ as Lord in your hearts, always ready to make a defense before anyone who demands of you a reason for the hope you have.',
    speaker: 'Peter',
    recipient: 'Believers'
  },
  {
    id: 24,
    reference: 'Ephesians 4:29',
    text: 'Let no unwholesome word proceed out of your mouth, but only what is good for building up as the need may be, so that it imparts what is favorable to the hearers.',
    speaker: 'Paul',
    recipient: 'Ephesian Church'
  },
  {
    id: 25,
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be courageous and strong. Do not be terrified or be dismayed, for Jehovah your God is with you wherever you go.',
    speaker: 'Jehovah',
    recipient: 'Joshua'
  },
  {
    id: 26,
    reference: 'Isaiah 43:19',
    text: 'Look! I am doing something new. Now it springs forth. Do you not know about it? I am putting a road in the wilderness and rivers in the desert.',
    speaker: 'Jehovah',
    recipient: 'Israel'
  },
  {
    id: 27,
    reference: 'Matthew 5:16',
    text: 'Likewise, let your light shine before people, so that they may see your fine works and give glory to your Father who is in the heavens.',
    speaker: 'Jesus',
    recipient: 'Disciples'
  },
  {
    id: 28,
    reference: 'Proverbs 22:6',
    text: 'Train up a boy according to the way he should go; even when he grows old, he will not depart from it.',
    speaker: 'Solomon',
    recipient: 'Reader'
  }
];
