import { defineStore } from "pinia";
import { ref } from "vue";
import request from "@/utils/request";
import API_URL from "../common/constants/api";

export const useUser = defineStore("user", {
    state: () => {
        return {
            userInfo: ref([]),
            userId: ref(),
            userName: ref(),
            userImage: ref(),
            role: ref(),
            location: ref(),
            personRole: ref(),
        };
    },
    actions: {
        signIn(password : string, username : string) {
            request
                .post(
                    API_URL.LOGIN.POST_LOGIN +
                    `?password=${password}&username=${username}`
                )
                .then((value) => {
                    let content = ref();
                    const colonIndex = value.data.indexOf(":");
                    if (colonIndex !== -1) {
                        content = value.data.slice(colonIndex + 2);
                        const token = content.toString();
                        sessionStorage.setItem("token", token);
                    }
                });
        },
        getUserInfo() {
            request(API_URL.COMMON.GET_USERINFORMATION_TOKEN , {
                method: "get",
            }).then((value) => {
                this.userInfo = value.data.User信息;
                this.role = value.data.User的角色[0];
                this.userId = value.data.User信息.id;
                this.userName = value.data.User信息.username;
                this.location = value.data.User信息.location;
                this.userImage = value.data.User信息.userImage;
                if (this.role == "common-user") {
                    this.personRole = "普通用户";
                } else if (this.role == "provider-user") {
                    this.personRole = "生产用户";
                } else if (this.role == "system-administrator") {
                    this.personRole = "系统管理员";
                }
            });
        },
        signUp(
            data : Object
        ) {
            request
                .post(
                    API_URL.REGISTER.POST_REGISTER , data
                )
                .then((value) => {
                    console.log(value)
                });
        },
        updatePermission(userId: number,role:string) {
            request
                .put(
                    API_URL.PERMISSION.PUT_PERMISSION+
                    `?userId=${userId}&role=${role}`
                )
                .then((value)=>{
                    console.log(value)
                })
        }
    },
});
