<template>
	<div id="articleList">
		<el-table :data="curPage" height="540" border>
			<el-table-column type="index" width="60px"></el-table-column>
			<el-table-column prop="title" label="标题" width="250px"></el-table-column>
			<el-table-column prop="pathName" label="路径" width="250px"></el-table-column>
			<el-table-column prop="updatedAt" label="最后修改日期" width="200px"></el-table-column>
			<el-table-column prop="tags" label="标签" width="180px" :filters="filterData" :filter-method="filterTag">
				<template scope="scope">
					<el-tag v-for="tag in scope.row.tags" key="tag"
						:type="'success'" close-transition>{{ tag }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200px">
				<template scope="scope">
					<el-button type="default" size="small" @click="checkArticle(scope.$index)">查看</el-button>
					<el-button type="info" size="small" @click="editArticle(scope.$index)">编辑</el-button>
					<el-button type="danger" size="small" @click="deleteArticle(scope.$index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-row>
			<el-col :span="24">
				<el-pagination
					layout="prev, pager, next"
					:total="articleList.length"
					@current-change="handleCurrentChange"
					:page-size="12"
					style="margin-top: 20px; float: right; margin-right: 40px;">
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data () {
			return {
				curPage: [],
				pageNum: 1
			}
		},
		computed: {
			articleList () {
				this.curPage = this.$store.state.articleList.length > 12 ? this.$store.state.articleList.slice(0, 12) : this.$store.state.articleList;
				return this.$store.state.articleList;
			},
			filterData () {
				let arr = [];
				for (let i in this.$store.state.tagList) {
					arr.push({
						text: this.$store.state.tagList[i].name,
						value: this.$store.state.tagList[i].name
					});
				}
				return arr;
			}
		},
		methods: {
	        filterTag (value, row) {
	        	return row.tags.indexOf(value) !== -1;
	     	},
	     	deleteArticle (index) {
	     		axios.post('http://localhost:3000/deleteArticle', { _id: this.articleList[index]._id, title: this.articleList[index].title }, {})
	     		.then((response) => {
	     			if (response.data.httpresult == 200) {
	     				this.$store.commit('deleteArticle', index);
	     				this.$notify.info({
	     					title: '消息',
	     					message: '成功删除文章'
	     				})
	     			}
	     			else {
	     				this.$notify.error({
	     					title: '错误',
	     					message: '删除文章失败'
	     				})
	     			}
	     		})
	     	},
	     	editArticle (index) {
	     		index = index + (this.pageNum - 1) * 12;
	     		this.$store.commit('changeCurSavedArticle', this.articleList[index]);
	     		this.$router.push('/back/articleEdit');
	     	},
	     	handleCurrentChange (value) {
	     		let allPage = Math.ceil(this.articleList.length / 12);
	     		this.pageNum = value;
	     		if (value == allPage) {
	     			this.curPage = this.articleList.slice((value - 1) * 12, this.articleList.length);
	     		}
	     		else {
	     			this.curPage = this.articleList.slice((value - 1) * 12, value * 12);
	     		}
	     	},
	     	checkArticle (index) {
	     		index = index + (this.pageNum - 1) * 12;
	     		let pathName = this.articleList[index].pathName;
	     		this.$store.commit('changeArticleIndex', index);
	     		this.$router.push('/front/article/' + pathName);
	     	}
		}
	}
</script>