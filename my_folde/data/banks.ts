import type { Bank } from "@/types/mortgage"

export const banks: Bank[] = [
  {
    id: "vtb",
    name: "ВТБ",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtb.jpg__1616183356__91676-4280175247.jpg-Md75EtrP597tQirAjAHZcUdkdit7e8.jpeg",
    programs: [
      {
        id: "vtb-standard",
        name: "Дальневосточная и арктическая поддержка",
        description: "Ипотека с господдержкой для жителей Дальнего Востока и Арктики",
        minRate: 6.0,
        maxRate: 7.0,
        maxAmount: 9000000,
        minInitialPayment: 20.1,
        term: {
          min: 12,
          max: 240, // 20 лет
        },
        requirements: ["Возраст от 21 года", "Стаж работы от 1 года", "Российское гражданство"],
        benefits: ["Быстрое одобрение", "Электронная регистрация", "Личный кабинет"],
        additionalInfo: ["Ставка может вырасти на 1% при отсутствии комплексного страхования"],
        type: "standard",
      },
      {
        id: "vtb-family",
        name: "Семейная ипотека",
        description: "Для семей с детьми, рожденными с 2018 года",
        minRate: 6.0,
        maxRate: 7.0,
        maxAmount: 30000000,
        minInitialPayment: 20.1,
        term: {
          min: 12,
          max: 360, // 30 лет
        },
        requirements: ["Семья с детьми от 2018 года рождения", "Российское гражданство"],
        benefits: ["Сниженная ставка", "Увеличенный срок", "Материнский капитал"],
        additionalInfo: ["Ставка может вырасти на 1% при отсутствии комплексного страхования"],
        type: "family",
      },
    ],
  },
  {
    id: "alfa",
    name: "Альфа-Банк",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148924bdee75aaaf2acd798a42f3e-2386489491-zmG74eNC5XNPkp2RjAP87bMiUua4qt.png",
    programs: [
      {
        id: "alfa-standard",
        name: "Стандартная ипотека",
        description: "Ипотека на покупку готового или строящегося жилья",
        minRate: 29.19,
        maxRate: 29.19,
        maxAmount: 70000000,
        minInitialPayment: 50,
        term: {
          min: 12,
          max: 360, // 30 лет
        },
        requirements: ["Возраст от 21 года", "Стаж работы от 1 года"],
        benefits: ["Быстрое одобрение", "Онлайн-заявка", "Электронная регистрация"],
        type: "standard",
      },
      {
        id: "alfa-it",
        name: "IT-ипотека",
        description: "Специальные условия для IT-специалистов",
        minRate: 4.7,
        maxRate: 5.5,
        maxAmount: 18000000,
        minInitialPayment: 30.1,
        term: {
          min: 12,
          max: 360, // 30 лет
        },
        requirements: ["Работа в аккредитованной IT-компании", "Профильное образование", "Возраст от 21 года"],
        benefits: ["Сниженная ставка", "Повышенная сумма кредита", "Специальные условия страхования"],
        type: "it",
      },
    ],
  },
  {
    id: "pik",
    name: "ПИК",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5f95558e061af-3100504273.png-KdddDBSlXV7euYihR2bHSfELztszJ4.webp",
    programs: [
      {
        id: "pik-standard",
        name: "Ипотека от ПИК",
        description: "Ипотека на новостройки от ПИК",
        minRate: 22.99,
        maxRate: 22.99,
        maxAmount: 100000000,
        minInitialPayment: 15,
        term: {
          min: 12,
          max: 360, // 30 лет
        },
        requirements: ["Возраст от 21 года", "Российское гражданство"],
        benefits: ["Онлайн-оформление", "Скидки на квартиры", "Бесплатное страхование"],
        type: "standard",
      },
    ],
  },
]

