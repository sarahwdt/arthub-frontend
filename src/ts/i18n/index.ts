import {createI18n} from "vue-i18n";
import {en, ru} from "vuetify/locale";

function customRule(choice: number, choicesLength: number, orgRule: number) {
    if (choice === 0) {
        return 0
    }

    const teen = choice > 10 && choice < 20
    const endsWithOne = choice % 10 === 1
    if (!teen && endsWithOne) {
        return 1
    }
    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
    }

    return choicesLength < 3 ? 2 : 3
}

const messages = {
    ru: {
        $vuetify: {
            ...ru
        },
        plural: {
            symbol: "символов | символ | символа | символов"
        },
        common: {
            error: "Ошибка"
        },
        page: {
            login: {
                form: {
                    registration: {
                        title: "Регистрация",
                        toLogin: {
                            text: "Уже имеете аккаунт?",
                            link: "Войти!"
                        },
                        button: {
                            register: "Зарегистрироваться",
                            clear: "Очистить"
                        },
                        notification: {
                            success: {
                                title: "Успешно",
                                body: "Регистрация прошла успешно!"
                            }
                        },
                        hint: {
                            password: "Пароль должен содержать от {l} до {r} @:plural.symbol и как минимум одну заглавную, одну строчную, одну цифру и один специальный символ"
                        }
                    },
                    login: {
                        title: "Вход",
                        toRegister: {
                            text: "Еще нету аккаунта?",
                            link: "Зарегистрироваться!"
                        },
                        button: {
                            login: "Войти",
                            clear: "Очистить"
                        }
                    },
                    field: {
                        username: "Имя пользователя",
                        email: "Email",
                        password: "Пароль",
                        passwordConfirmation: "Подтверждение пароля",
                    },
                    validation: {
                        username: {
                            required: "введите имя пользователя",
                            min: "имя пользователя должно содержать минимум {n} @:plural.symbol",
                            max: "имя пользователя должно содержать максимум {n} @:plural.symbol",
                        },
                        email: {
                            required: "введите email",
                            pattern: "email должен быть в валидном формате",
                        },
                        password: {
                            required: "введите пароль",
                            min: "пароль должен быть минимум {n} @:plural.symbol",
                            max: "пароль должен быть максимум {n} @:plural.symbol",
                            uppercase: "пароль должен содержать как минимум одну заглавную букву",
                            lowercase: "пароль должен содержать как минимум одну строчную букву",
                            digit: "пароль должен содержать как минимум одну цифру",
                            special: "пароль должен содержать как минимум один специальный символ"
                        },
                        passwordConfirmation: {
                            required: "введите подтверждение пароля",
                            match: "пароль и подтверждение не совпадают"
                        }
                    }
                }
            },
            clients: {
                headers: {
                    name: "Имя",
                    email: "Email",
                    phone: "Телефон"
                },
                button:{
                    create: "Добавить",
                    modify: "Изменить",
                    delete: "Удалить",
                },
                form: {
                    create: {
                        title: "Добавить информацию",
                        button: {
                            create: "Добавить"
                        },
                        field: {
                            firstName: "Имя",
                            lastName: "Фамилия",
                            patronymic: "Отчество",
                            email: "Email",
                            phone: "Телефон",
                        },
                        validation: {
                            firstName: {
                                required: "введите имя",
                            },
                            lastName: {
                                required: "введите фамилию",
                                max: "фамилия должна содержать максимум {n} @:plural.symbol",
                            },
                            patronymic: {
                                max: "отчество должно содержать максимум {n} @:plural.symbol",
                            },
                            email: {
                                required: "введите email",
                                max: "email должен содержать максимум {n} @:plural.symbol",
                                pattern: "email должен быть в валидном формате",
                            },
                            phone: {
                                required: "введите email",
                                max: "телефон должен содержать максимум {n} @:plural.symbol",
                                pattern: "телефон должен быть в валидном формате",
                            }
                        }
                    },
                    modify: {
                        title: "Изменить информацию",
                        button: {
                            modify: "Изменить"
                        }
                    }
                }
            }
        }
    },
    en: {
        $vuetify: {
            ...en
        },
        plural: {
            character: "character | character | characters"
        },
        common: {
            error: "Error"
        },
        page: {
            login: {
                form: {
                    registration: {
                        title: "Sign up",
                        toLogin: {
                            text: "Already have an account?",
                            link: "Sign in!"
                        },
                        button: {
                            register: "Sign up",
                            clear: "Clear",
                        },
                        hint: {
                            password: "Password should be between {l} and {r} @:plural.character long and contains at least one uppercase, one lowercase, one digit and one special character.",
                        }
                    },
                    login: {
                        title: "Sign in",
                        toRegister: {
                            text: "Have no account yet?",
                            link: "Sign up!"
                        },
                        button: {
                            login: "Sign in",
                            clear: "Clear"
                        }
                    },
                    field: {
                        username: "Username",
                        email: "Email",
                        password: "Password",
                        passwordConfirmation: "Password confirmation",
                    },
                    validation: {
                        username: {
                            required: "username is required",
                            min: "username should be at least {n} @:plural.character long",
                            max: "username should be at most {n} @:plural.character long",
                        },
                        email: {
                            required: "email is required",
                            pattern: "email should be valid email address",
                        },
                        password: {
                            required: "password is required",
                            min: "password should be at least {n} @:plural.character long",
                            max: "password should be at most {n} @:plural.character long",
                            uppercase: "password should have at least one uppercase letter",
                            lowercase: "password should have at least one lowercase letter",
                            digit: "password should have at least one digit",
                            special: "password should have at least one special character"
                        },
                        passwordConfirmation: {
                            required: "password confirmation is required",
                            match: "passwords doesn't match"
                        }
                    }
                }
            },
            clients: {
                button:{
                    create: "Add",
                    modify: "Update",
                    delete: "Delete",
                },
                headers: {
                    name: "Full name",
                    email: "Email",
                    phone: "Phone number"
                },
                form: {
                    create: {
                        title: "Add info about client",
                        field: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            patronymic: "Patronymic",
                            email: "Email",
                            phone: "Phone",
                        },
                        validation: {
                            firstName: {
                                required: "first name is required",
                            },
                            lastName: {
                                required: "last name is required",
                                max: "last name should be at most {n} @:plural.character long",
                            },
                            patronymic: {
                                max: "patronymic should be at most {n} @:plural.character long",
                            },
                            email: {
                                required: "email is required",
                                max: "email should be at most {n} @:plural.character long",
                                pattern: "email should be valid email address",
                            },
                            phone: {
                                required: "phone number is required",
                                max: "phone number should be at most {n} @:plural.character long",
                                pattern: "phone should be a valid phone number",
                            }
                        },
                        button: {
                            create: "Add"
                        }
                    },
                    modify: {
                        title: "Update info about client",
                        button: {
                            modify: "Update",
                        }
                    }
                }
            }
        }
    },
}

export default createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'en',
    availableLocales: ['ru', 'en'],
    pluralRules: {
        ru: customRule
    },
    messages: messages
});
