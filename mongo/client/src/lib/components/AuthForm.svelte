<script lang="ts">
	import { authStore } from "$lib/stores/Auth";

	$: ({
		email: storeUsername,
		password: storePassword,
		error,
		isRegistering,
	} = $authStore);

	let email = "";
	let password = "";

	$: email = storeUsername;
	$: password = storePassword;
	$: hasError = !!error;

	const handleAuth = async () => {
		authStore.updateField("email", email.toLowerCase());
		authStore.updateField("password", password);

		await authStore.handleAuth();
	};
</script>

<div
	class="w-[100vw] h-[40vh] fixed top-[20%] md:w-[600px] md:h-[300px] bg-[#121212] border-2 border-[#555555] rounded-xl"
>
	<div
		class="w-full h-full flex flex-col items-center justify-center p-8 space-y-4"
	>
		<h2 class="text-green-400 text-2xl mb-4">
			{isRegistering ? "Register" : "Sign In"}
		</h2>

		{#if error}
			<div class="text-red-500 text-sm">{error}</div>
		{:else}
			<div class="text-red-500 text-sm">&nbsp;</div>
		{/if}

		<input
			type="text"
			placeholder="Email"
			bind:value={email}
			class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400 lowercase {hasError
				? 'shake border-red-500'
				: ''}"
		/>

		<input
			type="password"
			placeholder="Password"
			bind:value={password}
			on:keydown={(e) => e.key === "Enter" && handleAuth()}
			class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400 {hasError
				? 'shake border-red-500'
				: ''}"
		/>

		<button
			on:click={handleAuth}
			class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors cursor-pointer"
		>
			{isRegistering ? "Register" : "Sign In"}
		</button>

		<button
			on:click={authStore.toggleAuthMode}
			class="text-green-400 hover:text-green-300 text-sm transition-colors cursor-pointer"
		>
			{isRegistering
				? "Already have an account? Sign In"
				: "Need an account? Register"}
		</button>
	</div>
</div>

<style>
	@keyframes shake {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-5px);
		}
		50% {
			transform: translateX(5px);
		}
		75% {
			transform: translateX(-5px);
		}
		100% {
			transform: translateX(0);
		}
	}

	.shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
